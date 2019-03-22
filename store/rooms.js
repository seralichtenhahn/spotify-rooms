import slugify from "slugify"
import firebase from "firebase/app"

export const actions = {
  async join({}, roomName) {
    const room = await this.$db
      .collection("rooms")
      .doc(roomName)
      .get()

    if (!room.exists) {
      throw new Error("Raum wurde nicht gefunden")
    }

    this.$router.push({ name: "rooms-id", params: { id: roomName } })

    return roomName
  },
  async create({ rootState }, roomName) {
    if (!rootState.user.isPremium) {
      throw new Error("Nur Spotify Premium Nutzer können einen Raum erstellen")
    }

    if (!roomName) {
      throw new Error("Gebe einen Namen ein")
    }

    const id = slugify(roomName, { lower: true })

    const roomDoc = await this.$db.collection("rooms").doc(id)
    const room = roomDoc.get()

    if (room.exists) {
      throw new Error("Raum existiert bereits")
    }

    const playlist = await this.$spotify.createPlaylist(rootState.user.id, {
      name: roomName
    })

    await roomDoc.set({
      title: roomName,
      owner: rootState.user.id,
      playlistId: playlist.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    this.$router.push({ name: "rooms-id", params: { id } })
  }
}
