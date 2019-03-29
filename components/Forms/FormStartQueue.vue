<template>
  <div class="form-create-room">
    
    <template v-if="queue.length">
      <p>Öffne deinen Spotify Client und startet die Playlist <strong>{{ title }}</strong>. Vergewissere dich, dass der Zufallsmodus deaktiviert ist.</p>
      <p v-if="error">{{ error }}</p>
      <button
        class="button--primary"
        @click="queueStarted"
      >
        Erledigt
      </button>
    </template>
    <p v-else>Füge mindestens einen Track der Warteschlange hinzu.</p>
    <button @click="cancel">Abbrechen</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      error: ""
    }
  },
  computed: {
    ...mapGetters("currentRoom", ["title", "queue", "isPlaying"])
  },
  /**
   * Holt alle verfügraben Geräte des Benutzers
   */
  async mounted() {
    const { devices } = await this.$spotify.getMyDevices()
    this.devices = devices
  },
  methods: {
    /**
     * Setzt aktives Gerät des Benutzers
     * Führt Actions aus zum starten der Warteschlange
     * Ruft Event auf um Modal zu deaktivieren
     * @param {string} device - id
     */
    async queueStarted() {
      await this.$store.dispatch("currentRoom/fetchPlayback")

      if (this.isPlaying) {
        this.$nuxt.$emit("modal:deactivate")
      } else {
        this.error = "Die Playlist wurde noch nicht gestartet"
      }
    },
    cancel() {
      this.$nuxt.$emit("modal:deactivate")
    }
  }
}
</script>
