const spotifyApi = require("./utils/spotify")
const setAccessToken = require("./utils/setAccessToken")
const admin = require("./utils/admin")

const db = admin.firestore()

exports.handler = async function(req, res) {
  // Nur POST Requests sind erlaubt
  if (req.method !== "POST") {
    return res.status(410).json({
      message: "Method not allowed"
    })
  }

  try {
    const payload = req.body

    // Fehler falls kein Refresh Token gegeben ist.
    if (!payload.firebase_token) {
      return res.status(422).json({
        message: "Required information is missing."
      })
    }

    const currentUser = await admin.auth().verifyIdToken(payload.firebase_token)

    const userID = currentUser.uid.substr(8) // remove "spotify:" from ui

    const userRef = await db
      .collection("users")
      .doc(userID)
      .get()

    const { refreshToken } = userRef.data()

    spotifyApi.setRefreshToken(refreshToken)

    const response = await spotifyApi.refreshAccessToken()

    if (response.statusCode !== 200) {
      // NOT res.status >= 200 && res.status < 300
      console.log(response.statusText)
      return res.status(response.status).json({ message: response.statusText })
    }

    const { access_token, expires_in } = response.body

    const task1 = admin.auth().createCustomToken(currentUser.uid)
    const task2 = setAccessToken(userID, access_token, false)

    const [firebase_token] = await Promise.all([task1, task2])

    return res.status(200).json({
      firebase_token,
      expires_in,
      access_token
    })
  } catch (err) {
    console.log(err) // output to firebase function log
    return res.status(500).json({ message: "invalid_token" })
  }
}
