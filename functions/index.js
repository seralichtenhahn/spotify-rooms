const functions = require("firebase-functions")
const admin = require("firebase-admin")

const refresh = require("./refresh")
const token = require("./token")

admin.initializeApp()

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.token = functions.https.onRequest(token.handler)
exports.refresh = functions.https.onRequest(refresh.handler)
