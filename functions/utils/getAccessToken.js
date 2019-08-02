const admin = require("./admin")
const spotifyApi = require("./spotify")
const setAccessToken = require("./setAccessToken")

const db = admin.firestore()

module.exports = async (userId, type = "accessToken") => {
  const user = await db
    .collection("users")
    .doc(userId)
    .get()

  const data = user.data()

  const { expiresIn, refreshToken } = data

  if (type === "accessToken" && expiresIn && expiresIn <= Date.now()) {
    spotifyApi.setRefreshToken(refreshToken)

    const response = await spotifyApi.refreshAccessToken()

    if (response.statusCode !== 200) {
      // NOT res.status >= 200 && res.status < 300
      console.log(response.statusText)
      throw new Error("Couldn't refresh access token")
    }

    const { access_token } = response.body

    await setAccessToken(userId, access_token)

    return access_token
  }

  return data[type]
}
