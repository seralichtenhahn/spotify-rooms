export const actions = {
  /**
   * Falls der AccessToken vvorhanden ist wird der Login Status zu true gesetzt
   * Falls der Token abgelaufen ist wird die Action auth/refreshTokens ausgeführt
   * Der Neue Token wird global gesetzt und alle Nutzt infos werden geholt
   * @param {object} StoreContext - vuex context.
   * @param {object} NuxtContext - https://nuxtjs.org/api/context/
   */
  async nuxtClientInit({ commit, dispatch, rootState }, { spotify, error }) {
    dispatch("device/init")
    const { accessToken, expiresIn } = rootState.auth

    if (accessToken) {
      commit("user/setLoginStatus", true)

      if (expiresIn && expiresIn <= Date.now()) {
        const response = await dispatch("auth/refreshTokens")

        if (response.status !== 200) {
          error({
            statusCode: response.status || 500,
            message: response.data.message
          })
        }
      }

      spotify.setAccessToken(rootState.auth.accessToken)

      await dispatch("user/fetchUser")
    }
  }
}
