const admin = require("./admin")

const db = admin.firestore()

module.exports = async roomId => {
  const room = await db
    .collection("rooms")
    .doc(roomId)
    .get()

  return room.data()
}
