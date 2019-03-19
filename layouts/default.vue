<template>
  <div class="app--layout">
    <nuxt/>
    <AppModal />
  </div>
</template>

<script>
import AppModal from "@/components/Modal/Modal"

export default {
  components: {
    AppModal
  },
  middleware: ["auth"]
}
</script>

<style lang="scss">
.app--layout {
  position: relative;
  height: 100%;
  min-height: 100vh;

  .row {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: rem(32 16);
    text-align: center;
  }
}
</style>
