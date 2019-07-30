const admin = require("./admin")

const db = admin.firestore()

module.exports = async (userId, type = "accessToken") => {
  const user = await db
    .collection("users")
    .doc(userId)
    .get()

  const data = user.data()

  return data[type]
}
