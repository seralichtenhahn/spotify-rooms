/**
 * Wenn die Funkton im Browser läuft wird die Action nuxtClientInit mit dem context ausgeführt
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 */
export default async context => {
  if (process.client) {
    await context.store.dispatch("nuxtClientInit", context)
  }
}
