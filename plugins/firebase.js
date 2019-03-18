import firebase from "firebase/app"
import "firebase/firestore"

export default (ctx, inject) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
  }

  firebase.initializeApp(config)

  const firestore = firebase.firestore()

  ctx.db = firestore
  inject("db", firestore)
}
