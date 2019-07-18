const SpotifyWebApi = require("spotify-web-api-node")
const env = require("./utils/env")

exports.handler = async function(req, res) {
  // Nur POST Requests sind erlaubt
  if (req.method !== "POST") {
    return res.status(410).json({
      message: "Method not allowed"
    })
  }

  try {
    // const payload = JSON.parse(event.body)
    const payload = req.body

    // Fehler falls kein Refresh Token gegeben ist.
    if (!payload.refresh_token) {
      return res.status(422).json({
        message: "Required information is missing."
      })
    }

    var spotifyApi = new SpotifyWebApi({
      clientId: env.spotify.client_id,
      clientSecret: env.spotify.client_secret
    })

    spotifyApi.setRefreshToken(payload.refresh_token)

    const response = await spotifyApi.refreshAccessToken()

    if (response.statusCode !== 200) {
      // NOT res.status >= 200 && res.status < 300
      console.log(response.statusText)
      return res.status(response.status).json({ message: response.statusText })
    }

    return res.status(200).json(response.body)
  } catch (err) {
    console.log(err) // output to firebase function log
    return res.status(500).json({ message: "invalid_token" })
  }
}
