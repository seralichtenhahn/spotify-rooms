import slugify from "slugify"
import firebase from "firebase/app"

export const actions = {
  /**
   * Versucht Raum in Datenbank zu finden
   * Nuutzer wird weitergeleitet fall der Raum gefunden wurde
   * @param {object} StoreContext - vuex context.
   * @param {string} roomName
   * @return {promise}
   */
  async join({}, roomName) {
    const id = slugify(roomName, { lower: true })

    const room = await this.$db
      .collection("rooms")
      .doc(id)
      .get()

    if (!room.exists) {
      throw new Error("Raum wurde nicht gefunden")
    }

    this.$router.push({ name: "rooms-id", params: { id } })
  },
  /**
   * Erstellt einen neuen Raum, inklusive Playlist
   * Nutzer wird weitergeleitet fall der Raum erfolgreich erstellt wurde
   * @param {object} StoreContext - vuex context.
   * @param {string} roomName
   * @return {promise}
   */
  async create({ rootState }, roomName) {
    if (!rootState.user.isPremium) {
      throw new Error("Nur Spotify Premium Nutzer können einen Raum erstellen")
    }

    if (!roomName) {
      throw new Error("Gebe einen Namen ein")
    }

    // Konventiert Raumname zu einzigartigem slug
    const id = slugify(roomName, { lower: true })

    const roomDoc = this.$db.collection("rooms").doc(id)
    const room = await roomDoc.get()

    // Checkt ob Raum bereits existiert
    if (room.exists) {
      throw new Error("Raum existiert bereits")
    }

    // Neue Playlist mit Raumnamen wird erstellt
    const playlist = await this.$spotify.createPlaylist(rootState.user.id, {
      name: roomName
    })

    // Raum wird in der Datenbank gespeichert
    await roomDoc.set({
      title: roomName,
      owner: rootState.user.username,
      owner_id: rootState.user.id,
      playlistId: playlist.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    this.$router.push({ name: "rooms-id", params: { id } })
  }
}
