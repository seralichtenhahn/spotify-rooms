<template>
  <div class="landing--page">
    <div class="landing--page--bg">
      <video
        v-if="!isEdge"
        :poster="poster"
        autoplay
        muted
        loop
        playsinline
      >
        <source
          src="~assets/videos/Cheering-Crowd.webm"
          type="video/webm"
        >
        <source
          src="~assets/videos/Cheering-Crowd.mp4"
          type="video/mp4"
        >
      </video>
      <img
        v-else
        :src="poster"
        alt="Spotify Rooms"
      >
    </div>
    <div class="landing--page--content">
      <div class="row--inner">
        <h1 class="underline">
          Spotify Rooms
        </h1>
        <p class="small">
          Alleine Musikhören ist auf Spotify kein Problem. Jedoch wenn mehrere Personen gleichzeitig ihre Liederwünsche abspielen möchten, entsteht ein heilloses durcheinander. Mit Spotify Rooms hast du die Möglichkeit zusammen mit den Menschen die dir etwas bedeuten ein unvergessliches Musiserlwebnis zu geniessen
        </p>
        <a
          :href="login"
          class="button button--primary button--block button--large"
        >
          Login With Spotify
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { stringify } from "querystring"
import { mapGetters } from "vuex"

export default {
  middleware: "anonymous",
  layout: "blank",
  computed: {
    ...mapGetters("device", ["isEdge"]),
    /**
     * Generiert die URL für das Poster
     * @return {string} url
     */
    poster() {
      return require("@/assets/images/poster.jpg")
    },
    /**
     * Generiert die URL zum Spotify Auth Service
     * @return {string} url
     */
    login() {
      // Alle für die Funktionalitäten der App benötigten Scopes
      // https://developer.spotify.com/documentation/general/guides/scopes/
      const scope = [
        "user-top-read",
        "user-read-private",
        "user-read-email",
        "user-modify-playback-state",
        "user-read-playback-state",
        "playlist-modify-private",
        "playlist-modify-public",
        "streaming"
      ].join(" ")

      const redirect_uri = location.protocol + "//" + location.host + "/rooms"

      return (
        "https://accounts.spotify.com/authorize?" +
        stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope,
          redirect_uri
        })
      )
    }
  }
}
</script>

<style lang="scss">
.landing--page {
  height: 100%;

  &--bg {
    position: absolute;
    top: 0;
    overflow: hidden;
    z-index: -1;
    width: 100%;
    height: 100%;

    video,
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &--content {
    height: 100%;
    padding: 10% 0;
    text-align: center;
    background-color: rgba($black, 0.4);

    .row--inner {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      p {
        padding-bottom: rh(4);
      }
    }

    @include breakpoint(medium) {
      padding-top: 20vh;

      .row--inner {
        height: auto;
      }
    }
  }
}
</style>
