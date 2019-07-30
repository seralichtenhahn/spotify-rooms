const spotifyApi = require("./utils/spotify")

const getTracks = require("./utils/getTracks")
const getAllTracks = require("./utils/getAllTracks")
const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")

exports.handler = async function(snap, context) {
  const { roomId, trackId } = context.params

  // Get All Tracks in Queue
  const getTracksTask = getTracks(roomId)
  const getAllTracksTask = getAllTracks(roomId)

  // Get Data of current Room
  const { owner_id, playlistId } = await getRoom(roomId)

  // Await all Promises
  const [tracks, allTracks, accessToken] = await Promise.all([
    getTracksTask,
    getAllTracksTask,
    getAccessToken(owner_id)
  ])

  const offset = allTracks.size - tracks.size

  // Get Index of Track sorted Queue
  const trackIndex = tracks.docs.findIndex(doc => doc.id === trackId)
  const position = trackIndex + offset

  console.log("set Track at", position, "with offset", offset)

  spotifyApi.setAccessToken(accessToken)

  await spotifyApi.addTracksToPlaylist(playlistId, [trackId], {
    position
  })
}
