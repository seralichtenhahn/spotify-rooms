<template>
  <div class="app--error">
    <div class="container">
      <IconCloseCircle class="icon" />
      <h1>{{ error.message }}</h1>
      <nuxt-link
        to="/"
        class="link link--primary"
      >
        Zurück zur Homepage
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import IconCloseCircle from "@/assets/icons/close-circle-outline.svg"

export default {
  layout: "blank",
  components: {
    IconCloseCircle
  },
  props: {
    error: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.app--error {
  width: 100%;
  height: 100%;
  display: flex;
  background-color: $grey-cod;
  justify-content: center;
  align-items: center;

  .container {
    text-align: center;

    .icon {
      width: rem(128);
      fill: $grey-mine;
    }
  }
}
</style>
