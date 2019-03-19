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
  //
}
