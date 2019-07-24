const spotifyApi = require("./utils/spotify")
const createFirebaseAccount = require("./utils/createFirebaseAccount")

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
    if (!payload.code || !payload.redirect_uri) {
      return res.status(422).json({
        message: "Required information is missing."
      })
    }

    spotifyApi.setRedirectURI(payload.redirect_uri)

    const response = await spotifyApi.authorizationCodeGrant(payload.code)

    if (response.statusCode !== 200) {
      // NOT res.status >= 200 && res.status < 300
      console.log(response.statusText)
      return res.status(response.status).json({ message: response.statusText })
    }

    const { access_token, refresh_token, expires_in } = response.body

    spotifyApi.setAccessToken(access_token)

    const user = await spotifyApi.getMe()

    const { id, display_name, images, email } = user.body

    const firebase_token = await createFirebaseAccount(
      id,
      display_name,
      images[0].url,
      email,
      access_token,
      refresh_token
    )

    return res.status(200).json({
      access_token,
      expires_in,
      firebase_token
    })
  } catch (err) {
    console.log(err) // output to firebase function log
    return res.status(500).json({ message: "invalid_token" })
  }
}
