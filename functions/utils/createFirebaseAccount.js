const admin = require("./admin")
const setAccessToken = require("./setAccessToken")

const auth = admin.auth()

module.exports = async function createFirebaseAccount(
  spotifyID,
  displayName,
  photoURL,
  email,
  accessToken,
  refreshToken
) {
  // The UID we'll assign to the user.
  const uid = `spotify:${spotifyID}`

  // Save the access token to Firestore.
  const databaseTask = setAccessToken(spotifyID, accessToken, refreshToken)

  // Create or update the user account.
  const userCreationTask = auth
    .updateUser(uid, {
      displayName,
      photoURL,
      email,
      emailVerified: true
    })
    .catch(error => {
      // If user does not exists we create it.
      if (error.code === "auth/user-not-found") {
        console.log("creating user:", displayName)
        return auth.createUser({
          uid,
          displayName,
          photoURL,
          email,
          emailVerified: true
        })
      }
      throw error
    })

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  await Promise.all([userCreationTask, databaseTask])
  // Create a Firebase custom auth token.
  const token = await admin.auth().createCustomToken(uid)
  console.log('Created Custom token for UID "', uid, '" Token:', token)
  return token
}
