export default async function({ store, redirect, query, spotify, error }) {
  if (store.state.user.loggedIn) {
    return
  }

  if (!query.code) {
    redirect("/")
  }

  const response = await store.dispatch("auth/fetchTokens", {
    code: query.code
  })

  const cleanUri = location.protocol + "//" + location.host + location.pathname
  window.history.replaceState({}, document.title, cleanUri)

  if (response.status !== 200) {
    error({
      statusCode: response.status || 500,
      message: response.data || "Something went wrong"
    })
  }

  spotify.setAccessToken(store.state.auth.accessToken)

  store.dispatch("user/fetchUser")
}
