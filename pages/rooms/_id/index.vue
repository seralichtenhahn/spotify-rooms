<template>
  <div class="row">
    <div>
      <h1>{{ title }}</h1>
      <h2>Room by {{ owner }}</h2>
    </div>
    <div class="queue">
      <h2>Queue:</h2>
      <ul>
        <li
          v-for="(song, index) in queue"
          :key="index"
        >
          <strong>{{ song.title }}</strong> by {{ song.artist }}
          <br>
          eingereicht von <i>{{ song.user }}</i>
        </li>
      </ul>
    </div>
    <div/>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
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
  }
}
</script>
