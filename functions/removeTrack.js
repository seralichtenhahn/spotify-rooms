const spotifyApi = require("./utils/spotify")
const admin = require("./utils/admin")

const db = admin.firestore()

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params
  const room = db.collection("rooms").doc(roomId)

  const { owner_id, playlistId } = (await room.get()).data()

  const user = await db
    .collection("users")
    .doc(owner_id)
    .get()

  const { accessToken } = user.data()

  spotifyApi.setAccessToken(accessToken)

  const tracks = await room
    .collection("queue")
    .orderBy("score", "desc")
    .orderBy("createdAt")
    .get()

  if (tracks.empty) {
    console.log("No matching documents.")
    return
  }

  console.log(trackId)

  const position = tracks.docs.findIndex(doc => doc.id === trackId)

  console.log(position)

  await spotifyApi.removeTracksFromPlaylistByPosition(playlistId, [position])
}
