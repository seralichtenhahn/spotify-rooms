const spotifyApi = require("./utils/spotify")
const admin = require("./utils/admin")

const db = admin.firestore()

exports.handler = async function(snap, context) {
  const roomName = context.params.roomId
  const { uri } = snap.data()

  const room = await db
    .collection("rooms")
    .doc(roomName)
    .get()

  const { owner_id: username, playlistId } = room.data()

  const user = await db
    .collection("users")
    .doc(username)
    .get()

  const { accessToken } = user.data()

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.addTracksToPlaylist(playlistId, [uri])
}
