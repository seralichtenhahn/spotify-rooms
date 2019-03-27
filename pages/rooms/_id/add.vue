<template>
  <div class="add-track--page">
    <div class="topbar">
      <div class="topbar--item left">
        <nuxt-link :to="{ name: 'rooms-id' }">
          <IconArrowBack class="icon" />
        </nuxt-link>
      </div>
      <div
        v-if="isMobile"
        class="topbar--item center"
      >
        Track hinzufügen
      </div>
      <div
        v-if="isMobile"
        class="topbar--item right"
      />
    </div>
    <div class="add-track--page--header">
      <div class="row--inner">
        <h1 v-if="!isMobile">
          Track hinzufügen
        </h1>
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
        <h3 v-if="!isMobile">
          {{ title }}
        </h3>
        <ul>
          <li
            v-if="isMobile"
            class="title"
          >
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
import { mapGetters } from "vuex"

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
  computed: {
    ...mapGetters("device", ["isMobile"])
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
  },
  transition(to, from) {
    return "slide-left"
  }
}
</script>

<style lang="scss">
.add-track--page {
  padding-top: rem(50);

  &--results {
    ul {
      overflow: scroll;
      height: calc(100vh - #{rem(80) + rem(130)});
      padding: rem(16);
      border-radius: rem(5);
      margin: 0;
      list-style: none;
      background-color: $grey-mine;

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
            padding: 0;
            margin: 0;
          }

          p {
            color: rgba($white, 0.6);
          }
        }

        .icon {
          width: rem(24);
          height: rem(24);
          fill: rgba($white, 0.6);
        }

        &:not(:last-child) {
          margin-bottom: rem(10);
        }
      }
    }
  }

  @include breakpoint(medium) {
    &--header {
      text-align: center;
    }

    &--results {
      overflow: auto;
      margin-top: rh(2);

      ul {
        padding: 0;
        padding-top: rem(16);
        background-color: $transparent;

        li {
          padding: rem(16);
          border-radius: rem(5);
          background-color: $grey-mine;
        }
      }
    }
  }
}
</style>
