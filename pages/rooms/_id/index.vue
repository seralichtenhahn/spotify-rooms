<template>
  <div class="row">
    <div class="topbar">
      <div class="left">
        <button @click="leaveRoom">
          X
        </button>
      </div>
    </div>
    <div>
      <h1>{{ title }}</h1>
      <h2>Room by {{ owner }}</h2>
    </div>
    <div class="queue">
      <h2>Queue:</h2>
      <ul>
        <CardTrack
          v-for="(track, index) in queue"
          :key="index"
          :track="track"
        />
      </ul>
    </div>
    <div>
      <nuxt-link
        :to="{ name: 'rooms-id-add' }"
        class="button"
      >
        Add Track
      </nuxt-link>
      <button
        v-if="isOwner"
        @click="setDevice"
      >
        Start Queue
      </button>
    </div>
    <portal
      v-if="showDeviceList"
      to="modal"
    >
      <FormDeviceList />
    </portal>
  </div>
</template>

<script>
import CardTrack from "@/components/Cards/CardTrack"
import FormDeviceList from "@/components/Forms/FormDeviceList"
import { mapGetters } from "vuex"

export default {
  components: {
    CardTrack,
    FormDeviceList
  },
  /**
   * Führt Action currentRoom/init mit der Raum Id aus
   * Gibt Raumdaten zurück
   * Falls Raum nicht gefunden wird, wird der Nutzter zur 404 Seiter weitergeleitet
   * @param {object} NuxtContext - https://nuxtjs.org/api/context/
   * @return {object} Room
   */
  async asyncData({ params, error, store }) {
    try {
      const room = await store.dispatch("currentRoom/init", params.id)

      return room
    } catch ({ message }) {
      error({
        statusCode: 404,
        message
      })
    }
  },
  data() {
    return {
      showDeviceList: false
    }
  },
  computed: {
    ...mapGetters("currentRoom", ["queue", "isOwner"])
  },
  methods: {
    /**
     * Führt Action currentRoom/reset aus
     * Leiter Nutzer zur Introseite weiter
     */
    leaveRoom() {
      this.$store.dispatch("currentRoom/reset")
      this.$router.push("/rooms")
    },
    /**
     * Setzt showDeviceList auf true
     * Ruft Event auf um Modal zu aktivieren mit dem Titel "Wähle dein aktives Gerät"
     */
    setDevice() {
      this.showDeviceList = true
      this.$nuxt.$emit("modal:activate", "Wähle dein aktives Gerät")
    }
  }
}
</script>
