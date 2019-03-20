import firebase from "firebase/app"

export const state = () => ({
  id: "",
  title: "",
  owner: "",
  queue: [],
  listener: null
})

export const getters = {
  id: state => state.id,
  title: state => state.title,
  owner: state => state.owner,
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
  async init({ commit }, id) {
    const room = await this.$db.collection("rooms").doc(id)
    const roomSnapshot = await room.get()

    if (!roomSnapshot.exists) {
      throw new Error("Raum existiert nicht")
    }
    commit("setId", room.id)

    const roomData = roomSnapshot.data()
    commit("setTitle", roomData.title)
    commit("setOwner", roomData.owner)

    const unsubscribe = room.collection("queue").onSnapshot(async queueRef => {
      const queue = await queueRef.query.orderBy("createdAt").get()
      const queueData = queue.docs.map(doc => doc.data())
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
  reset({ commit }) {
    commit("resetState")
  }
}
