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
  async mounted() {
    const { devices } = await this.$spotify.getMyDevices()
    console.log(devices)
    this.devices = devices
  },
  methods: {
    startQueue(device) {
      this.$store.commit("user/setDevice", device.id)
      this.$store.dispatch("currentRoom/start")
      this.$nuxt.$emit("modal:deactivate")
    }
  }
}
</script>
