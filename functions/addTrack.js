const spotifyApi = require("./utils/spotify")
const admin = require("./utils/admin")

const db = admin.firestore()

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params

  const room = await db
    .collection("rooms")
    .doc(roomId)
    .get()

  const { owner_id, playlistId } = room.data()

  const user = await db
    .collection("users")
    .doc(owner_id)
    .get()

  const { accessToken } = user.data()

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.addTracksToPlaylist(playlistId, [trackId])
}
