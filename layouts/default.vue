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

    .queue {
      overflow: scroll;
    }
  }

  .topbar {
    position: absolute;
    display: flex;
    width: 100%;
    height: rem(100);

    .left {
      align-self: flex-start;
    }
  }

  ul {
    margin: 0;
    list-style: none;

    li {
      box-sizing: border-box;
      padding: rem(12);
      border-bottom: rem(1) solid $black;

      strong {
        display: block;
        font-size: rem(18);
      }
    }
  }
}
</style>
