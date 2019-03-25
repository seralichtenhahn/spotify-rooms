/**
 * Leitet den Neutzer auf die Intro Seite weiter fall er eingeloggt ist
 * @param {object} NuxtContext -  https://nuxtjs.org/api/context/
 * @return {function} Redirect
 */
export default function({ store, redirect }) {
  if (store.state.user.loggedIn) {
    return redirect("/rooms")
  }
}
