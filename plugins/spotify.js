import Spotify from "spotify-web-api-js"

export default (ctx, inject) => {
  // Set the function directly on the context.app object
  const spotify = new Spotify()

  ctx.spotify = spotify
  inject("spotify", spotify)
}
