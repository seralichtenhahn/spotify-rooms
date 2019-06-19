import { mapGetters } from "vuex"
import differenceWith from "lodash/differenceWith"

export default {
  computed: {
    ...mapGetters("currentRoom", ["isOwner", "playlistId"]),
    queue() {
      return this.$store.state.currentRoom.queue
    }
  },
  mounted() {
    this.oldQueue = [...this.queue]
    this.$store.watch(state => state.currentRoom.queue, this.updatePlaylist)
  },
  methods: {
    updatePlaylist(queue) {
      const newTracks = differenceWith(
        queue,
        this.oldQueue,
        (newTrack, oldTrack) => {
          return newTrack.id === oldTrack.id
        }
      )

      // Speichert neue Tracks in der Playlist
      if (newTracks.length) {
        const uris = newTracks.map(track => track.uri)
        const index = queue.findIndex(track => track.score === -1)
        const position = index > -1 ? index - 1 : queue.length - 1
        this.$spotify.addTracksToPlaylist(this.playlistId, uris, {
          position
        })
      }

      // Überprüft ob Tracks neue Reihenfolge haben
      const updatedTracks = this.oldQueue.filter(track => {
        const newTrack = queue.find(_track => _track.id === track.id)
        return newTrack ? newTrack.score !== track.score : false
      })

      // Neue Position wird bestimmt
      updatedTracks.forEach(track => {
        const findTrack = _track => _track.id === track.id
        const position = this.oldQueue.findIndex(findTrack)
        const newPosition = queue.findIndex(findTrack)
        if (position !== newPosition) {
          this.$spotify.reorderTracksInPlaylist(
            this.playlistId,
            position,
            newPosition
          )
        }
      })

      this.oldQueue = [...queue]
    }
  },
  render() {
    return this.$slots.default
  }
}
