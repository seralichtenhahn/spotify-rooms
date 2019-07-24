const SpotifyWebApi = require("spotify-web-api-node")
const env = require("./env")

module.exports = new SpotifyWebApi({
  clientId: env.spotify.client_id,
  clientSecret: env.spotify.client_secret
})
