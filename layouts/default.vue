<template>
  <div class="app--layout">
    <nuxt/>
    <StripeRoomInfo />
    <AppModal />
  </div>
</template>

<script>
import AppModal from "@/components/Modal/Modal"
import StripeRoomInfo from "@/components/Stripes/StripeRoomInfo"

export default {
  components: {
    AppModal,
    StripeRoomInfo
  },
  middleware: ["auth"]
}
</script>

<style lang="scss">
.app--layout {
  min-height: 100%;
  background-color: $grey-cod;
}
</style>
