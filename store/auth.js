export const state = () => ({
  accessToken: "",
  expiresIn: 0,
  refreshToken: ""
})

export const getters = {
  accessToken: state => state.accessToken,
  expiresIn: state => state.expiresIn,
  refreshToken: state => state.refreshToken
}

export const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
  },
  setExpiresIn(state, expiresIn) {
    state.expiresIn = expiresIn
  },
  setRefreshToken(state, refreshToken) {
    state.refreshToken = refreshToken
  }
}

export const actions = {
  //
}
