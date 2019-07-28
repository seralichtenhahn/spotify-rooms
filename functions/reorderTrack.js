const spotifyApi = require("./utils/spotify")

const getRoom = require("./utils/getRoom")
const getAccessToken = require("./utils/getAccessToken")
const getTracks = require("./utils/getTracks")

exports.handler = async function(change, context) {
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

  const tracksDb = await getTracks(roomId)

  const dbIndex = tracksDb.docs.findIndex(track => track.id === trackId)

  if (dbIndex === playlistIndex) {
    // No reorder needed
    return
  }

  await spotifyApi.reorderTracksInPlaylist(
    playlistId,
    playlistIndex,
    dbIndex === tracksDb.docs.length - 1 ? dbIndex + 1 : dbIndex
  )

  console.log("Track moved from", playlistIndex, "to", dbIndex)
}
