export const state = () => ({
  votes: []
})

export const getters = {
  votes: state => state.votes
}

export const mutations = {
  addVote(state, vote) {
    state.votes.push(vote)
  },
  removeVote(state, index) {
    state.votes.splice(index, 1)
  }
}

export const actions = {
  updateVote({ commit, state }, data) {
    const index = state.votes.findIndex(vote => vote.trackId === data.trackId)
    if (index !== -1) {
      commit("removeVote", index)
    }
    commit("addVote", data)
  }
}
