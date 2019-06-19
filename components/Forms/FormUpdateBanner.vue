<template>
  <portal to="modal">
    <p>
      Eine neue bomige Version von <strong>Spotify Rooms</strong> ist verfügbar.
    </p>
    <button @click="update">Installieren</button>
  </portal>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: mapGetters("sw", ["swInstalling"]),
  methods: {
    update() {
      this.swInstalling.postMessage({ action: "skipWaiting" })
      this.$nuxt.$emit("modal:deactivate")
      this.$emit("close-banner")
    }
  }
}
</script>
