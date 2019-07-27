import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

/**
 * Initalisiert Firebase Applikation
 * Setzt Firestore in Context und App als db
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 * @param {function} inject
 */

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID
}

firebase.initializeApp(config)

const firestore = firebase.firestore()
const auth = firebase.auth()

const currentUser = new Promise(resolve =>
  auth.onAuthStateChanged(user => resolve(user))
)

export default (ctx, inject) => {
  ctx.auth = auth
  inject("auth", auth)

  ctx.currentUser = currentUser
  inject("currentUser", currentUser)

  ctx.db = firestore
  inject("db", firestore)
}

export const db = firestore
