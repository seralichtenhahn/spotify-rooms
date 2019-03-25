export const state = () => ({
  id: "",
  username: "",
  device: "",
  loggedIn: false,
  isPremium: false
})

export const getters = {
  id: state => state.id,
  username: state => state.username,
  device: state => state.device,
  isLoggedIn: state => state.loggedIn,
  isPremium: state => state.isPremium
}

export const mutations = {
  setId(state, id) {
    state.id = id
  },
  setUsername(state, username) {
    state.username = username
  },
  setDevice(state, device) {
    state.device = device
  },
  setLoginStatus(state, status) {
    state.loggedIn = status
  },
  setIsPremium(state, isPremium) {
    state.isPremium = isPremium
  }
}

export const actions = {
  /**
   * Holt Informaatione über Nutzer
   * Speichert Informationen im Store
   * @param {object} StoreContext - vuex context.
   */
  async fetchUser({ commit }) {
    try {
      const { display_name, id, product } = await this.$spotify.getMe()
      commit("setId", id)
      commit("setUsername", display_name)
      commit("setLoginStatus", true)
      commit("setIsPremium", product === "premium")
    } catch (e) {
      console.error(e)
    }
  }
}
