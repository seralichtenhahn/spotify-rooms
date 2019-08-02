const admin = require("./admin")

const db = admin.firestore()

module.exports = (spotifyID, accessToken, refreshToken) => {
  const oneHourInMilliseconds = 60 * 60 * 1000

  // Save the access token to Firestore.
  const data = {
    accessToken,
    expiresIn: Date.now() + oneHourInMilliseconds
  }

  if (refreshToken) {
    data.refreshToken = refreshToken
  }

  return db
    .collection("users")
    .doc(spotifyID)
    .set(data, { merge: true })
}
