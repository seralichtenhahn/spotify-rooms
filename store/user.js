export const state = () => ({
  id: "",
  username: "",
  loggedIn: false
})

export const getters = {
  id: state => state.id,
  username: state => state.username,
  isLoggedIn: state => state.loggedIn
}

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setUsername(state, username) {
    state.username = username
  },
  setLoginStatus(state, status) {
    state.loggedIn = status
  }
}

export const actions = {
  async fetchUser({ commit }) {
    try {
      const { display_name, id } = await this.$spotify.getMe()
      commit("setId", id)
      commit("setUsername", display_name)
      commit("setLoginStatus", true)
    } catch (e) {
      console.error(e)
    }
  }
}
