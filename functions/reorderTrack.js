const spotifyApi = require("./utils/spotify")

const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")
const getTracks = require("./utils/getTracks")
const getAllTracks = require("./utils/getAllTracks")

exports.handler = async function(change, context) {
  // Only run when score is changed
  if (change.after.get("score") === change.before.get("score")) {
    return null
  }

  const { roomId, trackId } = context.params

  const { playlistId, owner_id } = await getRoom(roomId)

  const accessToken = await getAccessToken(owner_id)

  spotifyApi.setAccessToken(accessToken)

  const response = await spotifyApi.getPlaylistTracks(playlistId, {
    fields: "items"
  })

  const playlistIndex = response.body.items.findIndex(
    item => item.track.uri === trackId
  )

  const [tracksDb, allTracksDb] = await Promise.all([
    getTracks(roomId),
    getAllTracks(roomId)
  ])

  const offset = allTracksDb.size - tracksDb.size
  const dbIndex = tracksDb.docs.findIndex(track => track.id === trackId)

  const realIndex = dbIndex + offset

  if (realIndex === playlistIndex) {
    // No reorder needed
    return
  }

  const updatedIndex =
    realIndex === allTracksDb.size - 1 ? realIndex + 1 : realIndex

  await spotifyApi.reorderTracksInPlaylist(
    playlistId,
    playlistIndex,
    updatedIndex
  )

  console.log(
    "Track moved from",
    playlistIndex,
    "to",
    updatedIndex,
    "with offset",
    offset
  )
}
