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
  /**
   * Checkt ob bereits eine Bewertunf vorhanden ist
   * Ersetzt allte Bewertung mit neuer Bewertung
   * Gibt Bewertung zurück
   * @param {object} StoreContext - vuex context.
   * @param {object} roomName
   * @return {number} index
   */
  updateVote({ commit, state }, data) {
    const index = state.votes.findIndex(vote => vote.trackId === data.trackId)
    if (index !== -1) {
      commit("removeVote", index)
    }
    commit("addVote", data)

    return index
  }
}
