const admin = require("./admin")

const db = admin.firestore()

module.exports = (spotifyID, accessToken, refreshToken) => {
  // Save the access token to Firestore.
  const data = {
    accessToken
  }

  if (refreshToken) {
    data.refreshToken = refreshToken
  }

  return db
    .collection("users")
    .doc(spotifyID)
    .set(data, { merge: true })
}
