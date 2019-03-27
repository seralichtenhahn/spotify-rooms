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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: $grey-cod;

  .container {
    text-align: center;

    .icon {
      width: rem(128);
      fill: $grey-mine;
    }
  }
}
</style>
