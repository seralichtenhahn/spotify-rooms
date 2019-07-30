<template>
  <div class="form-create-room">
    
    <template v-if="queue.length">
      <p>Willst du die Warteschlange wirklich zurücksetzten?</p>
      <p v-if="error">{{ error }}</p>
      <button
        class="button--primary"
        @click="resetQueue"
      >
        zurücksetzten
      </button>
    </template>
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
    ...mapGetters("currentRoom", ["title", "queue", "isPlaying", "id"])
  },
  methods: {
    async resetQueue() {
      this.$nuxt.$loading.start()

      const batch = this.$db.batch()

      const roomRef = this.$db.collection("rooms").doc(this.id)

      batch.update(roomRef, {
        isPlaying: false,
        currentTrack: null
      })

      this.queue.forEach(track => {
        const trackRef = roomRef.collection("queue").doc(track.id)
        batch.update(trackRef, { state: "queue" })
      })

      try {
        await this.$spotify.pause()
      } catch (err) {}

      await batch.commit()

      this.$nuxt.$loading.finish()
      this.$nuxt.$emit("modal:deactivate")
    },
    cancel() {
      this.$nuxt.$emit("modal:deactivate")
    }
  }
}
</script>
