export const actions = {
  async nuxtClientInit({ commit, dispatch, rootState }, { spotify, error }) {
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

      spotify.setAccessToken(accessToken)

      await dispatch("user/fetchUser")
    }
  }
}
