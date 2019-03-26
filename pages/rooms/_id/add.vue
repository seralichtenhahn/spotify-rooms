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
    /**
     * Führt fetchSongs() funktion aus wenn eine query vorhanden ist
     * @param {string} query
     */
    query(query) {
      if (query.length) {
        this.fetchSongs(query)
      }
    }
  },
  /**
   * Holt die 10 Top Tracks des Nutzers
   * Speichert die Resultate
   * @return {promise}
   */
  async mounted() {
    const { items } = await this.$spotify.getMyTopTracks({
      limit: 10
    })
    this.results = items
  },
  methods: {
    /**
     * Holt die 10 ersten Tracks die gefunden wurden
     * Speichert die Resultate
     * @param {string} query
     * @return {promise}
     */
    fetchSongs: debounce(async function(query) {
      const respone = await this.$spotify.searchTracks(query, {
        limit: 10
      })
      this.results = respone.tracks.items
    }, 150),
    /**
     * Führt die Action currentRoom/addTrack mit den Track Infos aus
     * Leitet den Nutzer auf die Raum Übersichtsseiter weiter
     * Fängt Error auf und zeigt Error in der Konsole
     * @param {object} SpotifyTrack
     * @return {promise}
     */
    async addSong(track) {
      try {
        await this.$store.dispatch("currentRoom/addTrack", {
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(", "),
          uri: track.uri
        })

        this.$router.push({ name: "rooms-id" })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>
