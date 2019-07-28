const spotifyApi = require("./utils/spotify")

const getTracks = require("./utils/getTracks")
const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params

  // Get All Tracks in Queue
  const getTracksTask = getTracks(roomId)

  // Get Data of current Room
  const { owner_id, playlistId } = await getRoom(roomId)

  // Await all Promises
  const [tracks, accessToken] = await Promise.all([
    getTracksTask,
    getAccessToken(owner_id)
  ])

  // Get Index of Track sorted Queue
  const position = tracks.docs.findIndex(doc => doc.id === trackId)

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.addTracksToPlaylist(playlistId, [trackId], {
    position
  })
}
