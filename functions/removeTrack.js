const spotifyApi = require("./utils/spotify")

const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params

  // Await all Promises
  const [room, accessToken] = await Promise.all([
    getRoom(roomId),
    getAccessToken(roomId)
  ])

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.removeTracksFromPlaylist(room.playlistId, [
    {
      uri: trackId
    }
  ])
}
