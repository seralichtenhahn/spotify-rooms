<template>
  <div class="add-track--page">
    <div class="topbar">
      <div class="topbar--item left">
        <nuxt-link :to="{ name: 'rooms-id' }">
          <IconArrowBack class="icon" />
        </nuxt-link>
      </div>
      <div class="topbar--item center">
        Track hinzufügen
      </div>
      <div class="topbar--item right"/>
    </div>
    <div class="add-track--page--header">
      <div class="row--inner">
        <input
          v-model="query"
          type="search"
          class="large"
          placeholder="Suchen"
        >
      </div>
    </div>
    <div class="add-track--page--results">
      <div class="row--outer">
        <ul>
          <li class="title">
            <h3>{{ title }}</h3>
          </li>
          <li
            v-for="song in results"
            :key="song.uri"
            @click="addSong(song)"
          >
            <img
              :src="song.album.images[1].url"
              :alt="song.name"
            >
            <div>
              <h4>{{ song.name }}</h4>
              <p class="small">{{ song.artists[0].name }}</p>
            </div>
            <IconAddCircle class="icon" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce"
import IconArrowBack from "@/assets/icons/arrow-back.svg"
import IconAddCircle from "@/assets/icons/add-circle-outline.svg"

export default {
  components: {
    IconArrowBack,
    IconAddCircle
  },
  async asyncData({ redirect, from, route }) {
    if (from.name === route.name) {
      redirect(`/rooms/${route.params.id}`)
    }
  },
  data() {
    return {
      query: "",
      title: "Deine Top Tracks",
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
    console.log(items)
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
      this.title = `Resultate für "${query}"`
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
          uri: track.uri,
          image: track.album.images.find(image => image.height === 300).url
        })

        this.$router.push({ name: "rooms-id" })
      } catch (error) {
        console.error(error)
      }
    }
  }
}
</script>

<style lang="scss">
.add-track--page {
  padding-top: rem(50);

  &--header {
    //
  }

  &--results {
    ul {
      margin: 0;
      height: calc(100vh - #{rem(80) + rem(130)});
      overflow: scroll;
      padding: rem(16);
      list-style: none;
      background-color: $grey-mine;
      border-radius: rem(5);

      li {
        display: flex;
        justify-content: space-between;
        align-items: center;

        img {
          width: rem(64);
          height: rem(64);
        }

        div {
          flex: 1 1;
          margin-left: rem(10);

          h4,
          p {
            margin: 0;
            padding: 0;
          }

          p {
            color: rgba($white, 0.6);
          }
        }

        .icon {
          fill: rgba($white, 0.6);
          width: rem(24);
          height: rem(24);
        }

        &:not(:last-child) {
          margin-bottom: rem(10);
        }
      }
    }
  }
}
</style>
