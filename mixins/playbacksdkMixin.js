export default {
  methods: {
    addPlaybackSDK() {
      console.log("loaded")

      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log(this.$store)
        const token = this.$store.state.auth.accessToken
        const player = new Spotify.Player({
          name: `Raum: ${this.$store.getters["currentRoom/title"]}`,
          getOAuthToken: cb => {
            cb(token)
          }
        })

        // Error handling
        player.addListener("initialization_error", ({ message }) => {
          console.error(message)
        })
        player.addListener("authentication_error", ({ message }) => {
          console.error(message)
        })
        player.addListener("account_error", ({ message }) => {
          console.error(message)
        })
        player.addListener("playback_error", ({ message }) => {
          console.error(message)
        })

        // Playback status updates
        player.addListener("player_state_changed", state => {
          console.log(state)
        })

        // Ready
        player.addListener("ready", ({ device_id }) => {
          console.log("Ready with Device ID", device_id)
        })

        // Not Ready
        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID has gone offline", device_id)
        })

        // Connect to the player!
        player.connect()

        this.player = player
      }

      const script = document.createElement("script")
      script.setAttribute("src", "https://sdk.scdn.co/spotify-player.js")
      // script.setAttribute("defer", true)
      document.head.appendChild(script)
    },
    removePlaybackSDK() {
      const src = "https://sdk.scdn.co/spotify-player.js"
      const el = document.querySelector('script[src="' + src + '"]')

      if (!el) {
        return
      }

      document.head.removeChild(el)

      if (this.player) {
        this.player.disconnect()
        this.player = null
      }
    }
  }
}
