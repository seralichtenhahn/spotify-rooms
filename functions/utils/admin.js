const admin = require("firebase-admin")
const serviceAccount = require("../service-account.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spotify-rooms-35887.firebaseio.com"
})

module.exports = admin
