/**
 * Wenn die Funkton im Browser läuft wird die Action nuxtClientInit mit dem context ausgeführt
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 */
export default context => {
  if (process.client) {
    context.store.dispatch("nuxtClientInit", context)
  }
}
