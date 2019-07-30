<template>
  <div class="app--error">
    <div class="container">
      <IconCloseCircle class="icon" />
      <h1>{{ error.message }}</h1>
      <nuxt-link
        v-if="!isHomepage"
        to="/"
        class="link link--primary"
      >
        Zurück zur Homepage
      </nuxt-link>
      <a
        v-else
        href="#"
        class="link link--primary"
        @click.prevent="reload"
      >
        Zurück zur Homepage
      </a>
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
  },
  computed: {
    isHomepage() {
      return this.$route.path === "/"
    }
  },
  methods: {
    reload() {
      this.$store.commit("auth/setExpiresIn", 1)
      window.location.reload()
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
      color: $grey-mine;
    }
  }
}
</style>
