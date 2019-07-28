const spotifyApi = require("./utils/spotify")
const admin = require("./utils/admin")

const db = admin.firestore()

exports.handler = async function(change, context) {
  const { roomId } = context.params

  const newValue = change.after.data()
  const previousValue = change.before.data()

  // Exit when no current Track is set
  if (!newValue.currentTrack) {
    return null
  }

  // Exit when no current not modified
  if (
    previousValue.currentTrack &&
    newValue.currentTrack.uri === previousValue.currentTrack.uri
  ) {
    return null
  }

  db.collection("rooms")
    .doc(roomId)
    .collection("queue")
    .doc(newValue.currentTrack.uri)
    .update({
      state: "playing"
    })

  if (previousValue.currentTrack) {
    db.collection("rooms")
      .doc(roomId)
      .collection("queue")
      .doc(previousValue.currentTrack.uri)
      .update({
        state: "played"
      })
  }
}
