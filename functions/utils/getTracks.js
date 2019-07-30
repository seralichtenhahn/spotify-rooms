const admin = require("./admin")

const db = admin.firestore()

module.exports = roomId => {
  return db
    .collection("rooms")
    .doc(roomId)
    .collection("queue")
    .where("state", "==", "queue")
    .orderBy("score", "desc")
    .orderBy("createdAt")
    .get()
}
