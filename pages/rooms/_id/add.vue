<template>
  <div class="row">
    <div class="topbar">
      <div class="left">
        <nuxt-link :to="{ name: 'rooms-id' }">
          X
        </nuxt-link>
      </div>
    </div>
    <div>
      <h1>Add Song</h1>
      <input
        v-model="query"
        type="text" 
      >
      <ul>
        <li
          v-for="song in results"
          :key="song.uri"
          @click="addSong(song)"
        >
          <strong>{{ song.name }}</strong> by {{ song.artists[0].name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce"

export default {
  async asyncData({ redirect, from, route }) {
    if (from.name === route.name) {
      redirect(`/rooms/${route.params.id}`)
    }
  },
  data() {
    return {
      query: "",
      results: []
    }
  },
  watch: {
    query(query) {
      if (query.length) {
        this.fetchSongs(query)
      }
    }
  },
  async mounted() {
    const { items } = await this.$spotify.getMyTopTracks({
      limit: 10
    })
    this.results = items
  },
  methods: {
    fetchSongs: debounce(async function(query) {
      const respone = await this.$spotify.searchTracks(query, {
        limit: 10
      })
      this.results = respone.tracks.items
    }, 150),
    async addSong(song) {
      try {
        await this.$store.dispatch("currentRoom/addTrack", {
          title: song.name,
          artist: song.artists.map(artist => artist.name).join(", "),
          uri: song.uri
        })

        this.$router.push({ name: "rooms-id" })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
