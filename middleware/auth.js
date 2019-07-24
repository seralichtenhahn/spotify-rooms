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
  auth
}) {
  if (auth.currentUser) {
    return
  }

  if (!query.code) {
    redirect("/")
  }

  const response = await store.dispatch("auth/fetchTokens", {
    code: query.code
  })

  // Entfernt den Code URL Parameter aus der Browser History, um Bugs zu vermeiden
  const cleanUri = location.protocol + "//" + location.host + location.pathname
  window.history.replaceState({}, document.title, cleanUri)

  if (response.status !== 200) {
    error({
      statusCode: response.status || 500,
      message: response.data || "Something went wrong"
    })
  }

  await store.dispatch("auth/signIn")

  // setzt Globaler Access Token
  spotify.setAccessToken(store.state.auth.accessToken)

  store.dispatch("user/fetchUser")
}
