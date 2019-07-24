const functions = require("firebase-functions")

const refresh = require("./refresh")
const token = require("./token")
const addTrack = require("./addTrack")

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.token = functions.https.onRequest(token.handler)
exports.refresh = functions.https.onRequest(refresh.handler)

exports.addTrack = functions.firestore
  .document("rooms/{room}/queue/{track}")
  .onCreate(addTrack.handler)
