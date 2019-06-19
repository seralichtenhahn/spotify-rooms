<template>
  <ul>
    <slot :queue="sortedQueue" />
  </ul>
</template>

<script>
import { mapGetters } from "vuex"
import differenceWith from "lodash/differenceWith"

export default {
  computed: {
    ...mapGetters("currentRoom", ["queue", "isOwner", "playlistId"]),
    sortedQueue() {
      return this.queue
    }
  }
}
</script>
