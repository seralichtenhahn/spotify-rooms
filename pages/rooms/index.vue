
<template>
  <div class="intro--page">
    <div class="row--inner">
      <h1>
        Spotify Rooms
      </h1>
      <div>
        <label for="roomName">
          <input
            v-model="roomName"
            type="text"
            placeholder="Raum beitreten"
            @keyup.enter="submit"
          >
        </label>
        <!-- <button @click="submit">Enter Room</button> -->
        <p v-if="error">
          {{ error }}
        </p>
        <p>Oder</p>
        <button
          class="button--block"
          @click="openModal"
        >
          Raum erstellen
        </button>
      </div>
    </div>
    <portal
      v-if="newRoomModalActive"
      to="modal"
    >
      <FormCreateRoom />
    </portal>
  </div>
</template>

<script>
import FormCreateRoom from "@/components/Forms/FormCreateRoom"

export default {
  components: {
    FormCreateRoom
  },
  data() {
    return {
      roomName: "",
      error: "",
      newRoomModalActive: false
    }
  },
  computed: {
    /**
     * Holt Nutzername des Nutzers aus dem Store
     * @return {string} - username
     */
    username() {
      return this.$store.getters["user/username"]
    }
  },
  methods: {
    /**
     * Führt Action aus um Raum mit eingegebenen Namen beizutretten
     * Setzt Error Meldung falls Fehler zurückgegeben wird
     * @return {Promise} Promise
     */
    async submit() {
      try {
        await this.$store.dispatch("rooms/join", this.roomName)
      } catch ({ message }) {
        this.error = message
      }
    },
    /**
     * Setzt newRoomModalActive auf true
     * Ruft Event auf um Modal zu aktivieren mit dem Titel "Gib einen Namen für deinen Raum ein"
     */
    openModal() {
      this.newRoomModalActive = true
      this.$nuxt.$emit("modal:activate", "Gib einen Namen für deinen Raum ein")
    }
  }
}
</script>

<style lang="scss">
.intro--page {
  padding: rh(2) 0;
  text-align: center;

  h1 {
    margin-bottom: rh(2);
  }

  @include breakpoint(medium) {
    padding: rh(4) 0;

    h1 {
      margin-bottom: rh(3);
    }
  }
}
</style>
