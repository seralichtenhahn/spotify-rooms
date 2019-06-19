import createPersistedState from "vuex-persistedstate"

/**
 * Erstellt neuer Persisted State aus den Modulen "auth" und "voting" mit dem Schlüssel "auth"
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 */
export default ({ store }) => {
  createPersistedState({
    key: "auth",
    paths: ["auth"]
  })(store)
}
