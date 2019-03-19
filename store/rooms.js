import slugify from "slugify"
import firebase from "firebase/app"

export const actions = {
  join({}, roomName) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await this.$db
          .collection("rooms")
          .doc(roomName)
          .get()

        if (!room.exists) {
          reject("Raum wurde nicht gefunden")
        }

        this.$router.push({ name: "rooms-id", params: { id } })
        resolve(roomName)
      } catch (error) {
        reject(error)
      }
    })
  },
  create({ rootState }, roomName) {
    return new Promise(async (resolve, reject) => {
      if (!roomName) {
        reject("Gebe einen Namen ein")
        return
      }

      const id = slugify(roomName, { lower: true })

      try {
        const roomDoc = await this.$db.collection("rooms").doc(id)
        const room = roomDoc.get()

        if (room.exists) {
          reject("Raum existirt bereits")
        }

        await roomDoc.set({
          title: roomName,
          owner: rootState.user.id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        this.$router.push({ name: "rooms-id", params: { id } })
        resolve(roomName)
      } catch (error) {
        reject(error)
      }
    })
  }
}
