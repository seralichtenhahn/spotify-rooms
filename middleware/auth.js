/**
 * Wird übersprungen falls Nutzer bereits eingeloggt ist
 * Leitet den Benutzer au f die Startseite weiter falls kein Code Url Parameter gegeben ist
 * Führt auth/fetchTokens Action aus und setzt Benuzter Credentials
 * @param {object} NuxtContext -  https://nuxtjs.org/api/context/
 */

export default async function({
  store,
  redirect,
  query,
  spotify,
  error,
  currentUser
}) {
  if (store.getters["user/isLoggedIn"]) {
    console.log("[auth] authenticated")
    return
  } else {
    const user = await currentUser

    if (user && user.uid) {
      console.log("[auth] authenticated")
      return
    }
  }

  if (!query.code) {
    return redirect("/")
  }

  const response = await store.dispatch("auth/fetchTokens", {
    code: query.code
  })

  if (response.status !== 200) {
    return error({
      statusCode: response.status || 500,
      message: response.data || "Something went wrong"
    })
  }

  await store.dispatch("auth/signIn")

  // setzt Globaler Access Token
  spotify.setAccessToken(store.state.auth.accessToken)

  store.dispatch("user/fetchUser")
}
