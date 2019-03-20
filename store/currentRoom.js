export const state = () => ({
  id: "",
  title: "",
  owner: "",
  queue: []
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

    room.collection("queue").onSnapshot(async queueRef => {
      const queue = await queueRef.query.orderBy("createdAt").get()
      const queueData = queue.docs.map(doc => doc.data())
      commit("setQueue", queueData)
    })

    return roomData
  }
}
