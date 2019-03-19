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
  async fetchTokens({ dispatch }, payload) {
    const redirect_uri = process.env.DEPLOY_PRIME_URI
      ? process.env.DEPLOY_PRIME_URI + "/rooms"
      : process.env.SPOTIFY_REDIRECT_URI
    try {
      const response = await this.$axios.post(
        process.env.NETLIFY_FUNCTIONS_URI + "/token",
        {
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
          ...payload
        }
      )

      dispatch("setCredentials", response.data)

      return response
    } catch (e) {
      console.error(e)
      return e
    }
  },
  async refreshTokens({ dispatch, state }) {
    try {
      const response = await this.$axios.post(
        process.env.NETLIFY_FUNCTIONS_URI + "/refresh",
        {
          refresh_token: state.refreshToken
        }
      )

      dispatch("setCredentials", response.data)

      return response
    } catch (e) {
      console.error(e)
      return e
    }
  },
  setCredentials({ commit }, credentials) {
    const expiresInMilliseconds = credentials.expires_in * 1000

    commit("setAccessToken", credentials.access_token)
    commit("setExpiresIn", Date.now() + expiresInMilliseconds)

    if (credentials.refresh_token) {
      commit("setRefreshToken", credentials.refresh_token)
    }
  }
}
