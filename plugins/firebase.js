import firebase from "firebase/app"
import "firebase/firestore"

/**
 * Initalisiert Firebase Applikation
 * Setzt Firestore in Context und App als db
 * @param {object} NuxtContext - https://nuxtjs.org/api/context/
 * @param {function} inject
 */

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID
}

firebase.initializeApp(config)

const firestore = firebase.firestore()

export default (ctx, inject) => {
  ctx.db = firestore
  inject("db", firestore)
}

export const db = firestore
