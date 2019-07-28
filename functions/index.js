const functions = require("firebase-functions")

const refresh = require("./refresh")
const token = require("./token")
const addTrack = require("./addTrack")
const removeTrack = require("./removeTrack")
const reorderTrack = require("./reorderTrack")

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.token = functions.https.onRequest(token.handler)
exports.refresh = functions.https.onRequest(refresh.handler)

exports.addTrack = functions.firestore
  .document("rooms/{roomId}/queue/{trackId}")
  .onCreate(addTrack.handler)
exports.reorderTrack = functions.firestore
  .document("rooms/{roomId}/queue/{trackId}")
  .onUpdate(reorderTrack.handler)
exports.removeTrack = functions.firestore
  .document("rooms/{roomId}/queue/{trackId}")
  .onDelete(removeTrack.handler)
