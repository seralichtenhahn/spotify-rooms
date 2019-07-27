export const state = () => ({
  accessToken: "",
  expiresIn: 0,
  firebaseToken: ""
})

export const getters = {
  accessToken: state => state.accessToken,
  expiresIn: state => state.expiresIn,
  firebaseToken: state => state.firebaseToken
}

export const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
  },
  setExpiresIn(state, expiresIn) {
    state.expiresIn = expiresIn
  },
  setFirebaseToken(state, firebaseToken) {
    state.firebaseToken = firebaseToken
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
        process.env.FIREBASE_FUNCTIONS_URI + "/token",
        {
          redirect_uri: location.protocol + "//" + location.host + "/rooms",
          ...payload
        }
      )

      dispatch("setCredentials", response.data)

      // Entfernt den Code URL Parameter aus der Browser History, um Bugs zu vermeiden
      const cleanUri =
        location.protocol + "//" + location.host + location.pathname
      window.history.replaceState({}, document.title, cleanUri)

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
  async refreshTokens({ dispatch }) {
    try {
      const user = await this.$currentUser
      const firebase_token = await user.getIdToken(true)
      const response = await this.$axios.post(
        process.env.FIREBASE_FUNCTIONS_URI + "/refresh",
        {
          firebase_token
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

    if (credentials.firebase_token) {
      commit("setFirebaseToken", credentials.firebase_token)
    }
  },
  async signIn({ state, commit, dispatch }) {
    console.log("trying to loggin...", state.firebaseToken)
    try {
      await this.$auth.signInWithCustomToken(state.firebaseToken)
      console.log(this.$auth.currentUser)
      commit("user/setLoginStatus", true, { root: true })
    } catch (error) {
      console.error(error)
      dispatch("error/create", error, { root: true })
    }
  }
}
