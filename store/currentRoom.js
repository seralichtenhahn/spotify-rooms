import firebase from "firebase/app"
import differenceWith from "lodash/differenceWith"

export const state = () => ({
  id: "",
  title: "",
  owner: "",
  playlistId: "",
  queue: [],
  listener: null
})

export const getters = {
  id: state => state.id,
  title: state => state.title,
  owner: state => state.owner,
  playlistId: state => state.playlistId,
  isOwner: (state, _getters, rootState) => state.owner === rootState.user.id,
  queue: state => state.queue
}

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setTitle(state, title) {
    state.title = title
  },
  setOwner(state, owner) {
    state.owner = owner
  },
  setPlaylistId(state, playlistId) {
    state.playlistId = playlistId
  },
  setQueue(state, queue) {
    state.queue = queue
  },
  setListener(state, listener) {
    state.listener = listener
  },
  resetState(state) {
    if (typeof state.listener === "function") {
      state.listener()
    }

    state.id = ""
    state.title = ""
    state.queue = []
    state.listener = null
  }
}

export const actions = {
  async init({ commit, getters, rootState, state }, id) {
    const room = await this.$db.collection("rooms").doc(id)
    const roomSnapshot = await room.get()

    if (!roomSnapshot.exists) {
      throw new Error("Raum existiert nicht")
    }
    commit("setId", room.id)

    const roomData = roomSnapshot.data()
    commit("setTitle", roomData.title)
    commit("setOwner", roomData.owner)

    if (getters.isOwner) {
      commit("setPlaylistId", roomData.playlistId)
    }

    const unsubscribe = room.collection("queue").onSnapshot(async snapshot => {
      const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server"
      if (source === "Local") {
        return
      }

      const queue = await snapshot.query.orderBy("createdAt").get()
      const queueData = queue.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      if (getters.isOwner && getters.queue.length) {
        const newTracks = differenceWith(
          queueData,
          getters.queue,
          (newTrack, oldTrack) => {
            return newTrack.id === oldTrack.id
          }
        )

        if (newTracks.length) {
          const uris = newTracks.map(track => track.uri)
          this.$spotify.addTracksToPlaylist(state.playlistId, uris)
        }
      }

      commit("setQueue", queueData)
    })

    commit("setListener", unsubscribe)

    return roomData
  },
  async addTrack({ state, rootState }, trackData) {
    await this.$db
      .collection("rooms")
      .doc(state.id)
      .collection("queue")
      .add({
        ...trackData,
        user: rootState.user.username,
        score: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      })
  },
  async voteTrack({ state, dispatch }, { id, mode }) {
    const track = state.queue.find(track => track.id === id)

    const index = await dispatch(
      "voting/updateVote",
      {
        trackId: id,
        mode
      },
      { root: true }
    )

    console.log(index)

    let value = mode === "up" ? 1 : -1

    if (index > -1) {
      value = value * 2
      console.log(value)
    }

    const score = track.score + value

    console.log(track, score)

    await this.$db
      .collection("rooms")
      .doc(state.id)
      .collection("queue")
      .doc(id)
      .update({
        score: track.score + value
      })
  },
  async start({ rootState, state }) {
    await this.$spotify.setShuffle(false, {
      device_id: rootState.user.device
    })
    await this.$spotify.play({
      device_id: rootState.user.device,
      context_uri: `spotify:playlist:${state.playlistId}`
    })
  },
  reset({ commit }) {
    commit("resetState")
  }
}
