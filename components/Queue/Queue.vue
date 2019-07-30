<template>
  <ul>
    <slot
      :queue="filteredQueue"
      :playing="currentlyPlaying"
    />
  </ul>
</template>

<script>
import { mapGetters } from "vuex"
import differenceWith from "lodash/differenceWith"

export default {
  computed: {
    ...mapGetters("currentRoom", ["queue", "isOwner", "playlistId"]),
    filteredQueue() {
      return this.queue.filter(track => track.state === "queue")
    },
    currentlyPlaying() {
      return this.queue.find(track => track.state === "playing")
    }
  }
}
</script>
