import Spotify from "spotify-web-api-js"

export default (ctx, inject) => {
  const spotify = new Spotify()

  ctx.spotify = spotify
  inject("spotify", spotify)
}
