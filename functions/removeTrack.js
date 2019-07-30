const spotifyApi = require("./utils/spotify")

const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params

  // Await all Promises
  const { owner_id } = await getRoom(roomId)

  const accessToken = await getAccessToken(owner_id)

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.removeTracksFromPlaylist(room.playlistId, [
    {
      uri: trackId
    }
  ])
}
