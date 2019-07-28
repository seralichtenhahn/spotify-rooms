import firebase from "firebase/app"
import get from "lodash/get"
import { firestoreAction } from "vuexfire"
import { db } from "@/plugins/firebase"

export const state = () => ({
  queue: [],
  room: null
})

export const getters = {
  id: state => get(state.room, "id"),
  title: state => get(state.room, "title"),
  owner: state => get(state.room, "owner"),
  owner_id: state => get(state.room, "owner_id"),
  playlistId: state => get(state.room, "playlistId"),
  isOwner: (_state, getters, rootState) => {
    if (getters.owner_id) {
      return getters.owner_id === rootState.user.id
    }

    // For old rooms without owner_id
    return getters.owner === rootState.user.id
  },
  queue: state => state.queue,
  isPlaying: state => get(state.room, "isPlaying"),
  currentTrack: state => get(state.room, "currentTrack")
}

export const actions = {
  /**
   * initialisiert den betrettenen Raum für den Nutzer
   * Erstellte alle Hörer um Änderungen in Echtzeit zu erhalten
   * Gibt die Raum Daten zurück
   * @param {object} StoreContext - vuex context.
   * @param {string} roomID
   * @return {promise}
   */
  init: firestoreAction(async ({ bindFirestoreRef, getters, state }, id) => {
    // Raum wurde bereits initialisiert
    if (getters.id) {
      return
    }

    await bindFirestoreRef("room", db.collection("rooms").doc(id))

    if (!state.room) {
      throw new Error("Raum existiert nicht")
    }

    // Wird bei Änderungen der Warteschlange ausgeführt
    await bindFirestoreRef(
      "queue",
      db
        .collection("rooms")
        .doc(id)
        .collection("queue")
        .orderBy("score", "desc")
        .orderBy("createdAt")
    )
  }),
  /**
   * Fügt einen neuen Track der Datenbank hinzu
   * @param {object} StoreContext - vuex context.
   * @param {object} trackData
   */
  async addTrack({ getters, rootState }, { uri, ...trackData }) {
    const trackRef = this.$db
      .collection("rooms")
      .doc(getters.id)
      .collection("queue")
      .doc(uri)
    const track = await trackRef.get()

    // Checkt ob Track bereits existiert
    if (track.exists) {
      throw new Error("Track existiert bereits")
    }

    await trackRef.set({
      ...trackData,
      user: rootState.user.username,
      score: 0,
      state: "queue",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  },
  /**
   * Entfernt einen Track aus der Playlist und der Warteschlange
   * @param {object} StoreContext - vuex context.
   * @param {object} Track
   */
  async removeTrack({ getters }, track) {
    await this.$db
      .collection("rooms")
      .doc(getters.id)
      .collection("queue")
      .doc(track.id)
      .delete()
  },
  /**
   * Setzt den aktuellen Raum zurück
   * @param {object} StoreContext - vuex context.
   */
  reset: firestoreAction(({ unbindFirestoreRef }) => {
    unbindFirestoreRef("room")
    unbindFirestoreRef("queue")
  })
}
