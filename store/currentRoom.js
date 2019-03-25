import firebase from "firebase/app"
import differenceWith from "lodash/differenceWith"

export const state = () => ({
  id: "",
  title: "",
  owner: "",
  playlistId: "",
  queue: [],
  isPlaying: false,
  currentTrack: null,
  hydrated: false,
  listeners: [],
  timeout: null
})

export const getters = {
  id: state => state.id,
  title: state => state.title,
  owner: state => state.owner,
  playlistId: state => state.playlistId,
  isOwner: (state, _getters, rootState) => state.owner === rootState.user.id,
  queue: state => state.queue,
  isPlaying: state => state.isPlaying,
  currentTrack: state => state.currentTrack
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
  setIsPlaying(state, isPlaying) {
    state.isPlaying = isPlaying
  },
  setCurrentTrack(state, currentTrack) {
    state.currentTrack = currentTrack
  },
  setHydrated(state, hydrated) {
    state.hydrated = hydrated
  },
  addListener(state, listener) {
    state.listeners.push(listener)
  },
  addTimeout(state, timeout) {
    state.timeout = timeout
  },
  removeTimeout(state) {
    clearTimeout(state.timeout)
  },
  resetState(state) {
    state.id = ""
    state.title = ""
    state.queue = []
    state.isPlaying = false
    state.currentTrack = null
    state.hydrated = false
    state.listeners = []
    state.timeout = null
  }
}

export const actions = {
  async init({ commit, getters, dispatch, state }, id) {
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
      dispatch("fetchPlayback")
    }

    const roomListener = room.onSnapshot(async snapshot => {
      const { isPlaying, currentTrack } = snapshot.data()

      commit("setIsPlaying", isPlaying)
      commit("setCurrentTrack", currentTrack)
    })

    commit("addListener", roomListener)

    const queueListener = room
      .collection("queue")
      .onSnapshot(async snapshot => {
        const queue = await snapshot.query
          .orderBy("score", "desc")
          .orderBy("createdAt")
          .get()
        const queueData = queue.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        // Überprüft ob neue Tracks vorhanden sind
        if (getters.isOwner && state.hydrated) {
          const newTracks = differenceWith(
            queueData,
            getters.queue,
            (newTrack, oldTrack) => {
              return newTrack.id === oldTrack.id
            }
          )

          if (newTracks.length) {
            const uris = newTracks.map(track => track.uri)
            const index = queueData.findIndex(track => track.score === -1)
            const position = index > -1 ? index - 1 : queueData.length - 1
            this.$spotify.addTracksToPlaylist(state.playlistId, uris, {
              position
            })
          }
        }

        // Überprüft ob Tracks neue Reihenfolge haben
        if (getters.isOwner) {
          //
        }

        commit("setQueue", queueData)
        commit("setHydrated", true)
      })

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange.bind(this)
    )

    commit("addListener", queueListener)

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
  async fetchPlayback({ dispatch, commit }) {
    const playback = await this.$spotify.getMyCurrentPlaybackState()
    console.log(playback)
    const isPlaying = await dispatch("checkIfQueueIsPlaying", playback)
    if (isPlaying) {
      dispatch("checkCurrentTrack", playback)

      commit("removeTimeout")
      const timeLeft = playback.item.duration_ms - playback.progress_ms
      const timeout = setTimeout(() => {
        dispatch("fetchPlayback")
      }, timeLeft)
      commit("addTimeout", timeout)
    }
  },
  async checkIfQueueIsPlaying({ state }, playback) {
    const isPlaying =
      playback.is_playing && playback.context.uri.includes(state.playlistId)
    await this.$db
      .collection("rooms")
      .doc(state.id)
      .update({
        isPlaying
      })
    return isPlaying
  },
  checkCurrentTrack({ state }, { item }) {
    if (!item) {
      return
    }

    this.$db
      .collection("rooms")
      .doc(state.id)
      .update({
        currentTrack: {
          title: item.name,
          artist: item.artists.map(artist => artist.name).join(", "),
          image: item.album.images.find(image => image.height === 300).url
        }
      })
  },
  async prevTrack({ dispatch }) {
    await this.$spotify.skipToPrevious()
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 100)
  },
  async nextTrack({ dispatch }) {
    await this.$spotify.skipToNext()
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 100)
  },
  async changePlayState({ dispatch, state }) {
    if (state.isPlaying) {
      await this.$spotify.pause()
    } else {
      await this.$spotify.play()
    }
    setTimeout(() => {
      dispatch("fetchPlayback")
    }, 100)
  },
  reset({ commit, getters, state }) {
    if (getters.isOwner) {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
    state.listeners.forEach(listener => listener())
    commit("resetState")
  }
}

function handleVisibilityChange() {
  if (!document.hidden) {
    this.dispatch("currentRoom/fetchPlayback")
  }
}
