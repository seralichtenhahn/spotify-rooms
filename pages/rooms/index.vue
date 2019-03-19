<template>
  <div class="row">
    <h1>
      Rooms
    </h1>
    <div>
      <label for="roomName">
        <input
          v-model="roomName"
          type="text"
          placeholder="Enter a name"
          @keyup.enter="submit"
        >
      </label>
      <button @click="submit">Enter Room</button>
      <p v-if="error">
        {{ error }}
      </p>
      <hr>
      <button @click="openModal">
        Create New Room
      </button>
    </div>
    <p>
      <strong>User:</strong>{{ username }}
    </p>
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
    username() {
      return this.$store.getters["user/username"]
    }
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch("rooms/join", this.roomName)
      } catch (error) {
        this.error = error
      }
    },
    openModal() {
      this.newRoomModalActive = true
      this.$nuxt.$emit("modal:activate", "Create new Room")
    }
  }
}
</script>
