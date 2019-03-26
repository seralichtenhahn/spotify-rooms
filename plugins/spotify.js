import Spotify from "spotify-web-api-js"

/**
 * Initalisiert Spotify WebAPI Wrapper
 * Setzt Spotify in Context und App als spotify
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 * @param {function} inject
 */
export default (ctx, inject) => {
  const spotify = new Spotify()

  ctx.spotify = spotify
  inject("spotify", spotify)
}
