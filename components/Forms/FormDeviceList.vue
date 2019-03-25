<template>
  <div class="form-create-room">
    <ul v-if="devices.length">
      <li
        v-for="device in devices"
        :key="device.id"
        @click="startQueue(device)"
      >
        {{ device.name }}
      </li>
    </ul>
    <div v-else>
      No Devices found
    </div>
  </div>
</template>
§
<script>
export default {
  data() {
    return {
      devices: []
    }
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
    startQueue(device) {
      this.$store.commit("user/setDevice", device.id)
      this.$store.dispatch("currentRoom/start")
      this.$nuxt.$emit("modal:deactivate")
    }
  }
}
</script>
