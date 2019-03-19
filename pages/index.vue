<template>
  <div class="row">
    <h1>
      Spotify Rooms
    </h1>
    <a
      :href="login"
      class="button"
    >
      Login With Spotify
    </a>
  </div>
</template>

<script>
import { stringify } from "querystring"

export default {
  middleware: "anonymous",
  layout: "blank",
  computed: {
    login() {
      const scope = [
        "user-top-read",
        "user-read-private",
        "user-read-email",
        "user-modify-playback-state",
        "user-read-playback-state"
      ].join(" ")

      return (
        "https://accounts.spotify.com/authorize?" +
        stringify({
          response_type: "code",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          scope,
          redirect_uri: process.env.SPOTIFY_REDIRECT_URI
        })
      )
    }
  }
}
</script>
