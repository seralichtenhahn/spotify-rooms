<template>
  <div class="form-create-room">
    <input
      v-model="roomName"
      type="text"
    >
    <p v-if="error">
      {{ error }}
    </p>
    <button @click="cancel">
      Abbrechen
    </button>
    <button @click="submit">
      Erstellen
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roomName: "",
      error: ""
    }
  },
  methods: {
    /**
     * Ruft Event auf um Modal zu deaktivieren
     */
    cancel() {
      this.$nuxt.$emit("modal:deactivate")
    },
    /**
     * Führt Action aus um neuen raum mit eingegebenen Namen zu erstellen
     * Deaktiviert Modal bei Erfolg
     * Setzt Error Meldung falls Fehler zurückgegeben wird
     * @return {Promise} Promise
     */
    async submit() {
      try {
        await this.$store.dispatch("rooms/create", this.roomName)
        this.$nuxt.$emit("modal:deactivate")
      } catch ({ message }) {
        this.error = message
      }
    }
  }
}
</script>
