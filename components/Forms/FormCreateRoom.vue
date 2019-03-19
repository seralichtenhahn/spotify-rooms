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
    cancel() {
      this.$nuxt.$emit("modal:deactivate")
    },
    async submit() {
      try {
        await this.$store.dispatch("rooms/create", this.roomName)
        this.$nuxt.$emit("modal:deactivate")
      } catch (error) {
        this.error = error
      }
    }
  }
}
</script>
