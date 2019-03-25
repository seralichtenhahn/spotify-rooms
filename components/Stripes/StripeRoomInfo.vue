<template>
  <div class="stripe--room-info">
    <template v-if="id">
      <div class="track">
        <template v-if="currentTrack">
          <img
            :src="currentTrack.image" 
            :alt="currentTrack.title"
          >
          <div>
            <p>{{ currentTrack.title }}</p>
            <p>{{ currentTrack.artist }}</p>
          </div>
        </template>
      </div>
      <div
        v-if="isOwner"
        class="controls"
      >
        <button @click="prevTrack">Back</button>
        <button @click="changePlayState">Play/Pause</button>
        <button @click="nextTrack">Next</button>
      </div>
      <div class="state">
        <span v-if="isPlaying">Warteschlange läuft</span>
      </div>
    </template>
    <template v-else>
      No Room 
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters("currentRoom", ["isPlaying", "currentTrack", "isOwner", "id"])
  },
  methods: {
    /*
     * Führt Actions aus zum starten des letzten Tracks in der Wartesclange
     */
    prevTrack() {
      this.$store.dispatch("currentRoom/prevTrack")
    },
    /*
     * Führt Actions aus zum ändern des Play Status
     */
    changePlayState() {
      this.$store.dispatch("currentRoom/changePlayState")
    },
    /*
     * Führt Actions aus zum starten des nächsten Tracks in der Wartesclange
     */
    nextTrack() {
      this.$store.dispatch("currentRoom/nextTrack")
    }
  }
}
</script>

<style lang="scss">
.stripe--room-info {
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: rem(80);
  padding: rem(10);
  background-color: $gray-dove;

  .track {
    display: flex;

    img {
      width: auto;
      height: rem(60);
    }

    p {
      padding: 0;
      margin-bottom: rem(6);
    }
  }
}
</style>
