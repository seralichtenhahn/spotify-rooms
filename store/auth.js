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
  /**
   * Sendet den Authentifizierungscode an die token Lamda function.
   * Mit den Rückgabewerten werden die Credentials für den benutzer gesetzt.
   * @param {object} StoreContext - vuex context.
   * @param {object} payload - Authentifizierungscode von Spotify
   * @return {object} Rückgabewert der Lamda function
   */
  async fetchTokens({ dispatch }, payload) {
    try {
      const response = await this.$axios.post(
        process.env.NETLIFY_FUNCTIONS_URI + "/token",
        {
          redirect_uri: location.protocol + "//" + location.host + "/rooms",
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
  /**
   * Sendet den Refreshtoken an die token Lamda function.
   * Mit den Rückgabewerten werden die Credentials für den benutzer gesetzt.
   * @param {object} StoreContext - vuex context.
   * @return {object} Rückgabewert der Lamda function
   */
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
  /**
   * Setzt die credentials des Benutzers mittels Mutations in den Store
   * @param {object} StoreContext - vuex context.
   * @param {object} credentials - Spotify credentials
   */
  setCredentials({ commit }, credentials) {
    const expiresInMilliseconds = credentials.expires_in * 1000

    commit("setAccessToken", credentials.access_token)
    commit("setExpiresIn", Date.now() + expiresInMilliseconds)

    if (credentials.refresh_token) {
      commit("setRefreshToken", credentials.refresh_token)
    }
  }
}
