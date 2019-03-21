<template>
  <div class="row">
    <div class="topbar">
      <div class="left">
        <button @click="leaveRoom">
          X
        </button>
      </div>
    </div>
    <div>
      <h1>{{ title }}</h1>
      <h2>Room by {{ owner }}</h2>
    </div>
    <div class="queue">
      <h2>Queue:</h2>
      <ul>
        <CardTrack
          v-for="(track, index) in queue"
          :key="index"
          :track="track"
        />
      </ul>
    </div>
    <div>
      <nuxt-link
        :to="{ name: 'rooms-id-add' }"
        class="button"
      >
        Add Track
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import CardTrack from "@/components/Cards/CardTrack"
import { mapGetters } from "vuex"

export default {
  components: {
    CardTrack
  },
  async asyncData({ params, error, store }) {
    try {
      const room = await store.dispatch("currentRoom/init", params.id)

      return room
    } catch ({ message }) {
      error({
        statusCode: 404,
        message
      })
    }
  },
  computed: {
    ...mapGetters("currentRoom", ["queue"])
  },
  methods: {
    leaveRoom() {
      this.$store.dispatch("currentRoom/reset")
      this.$router.push("/rooms")
    }
  }
}
</script>
