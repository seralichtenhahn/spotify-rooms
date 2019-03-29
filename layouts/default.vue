<template>
  <div class="app--layout">
    <nuxt/>
    <StripeRoomInfo />
    <AppModal />
    <portal
      v-if="error"
      to="modal"
    >
      <p>
        {{ error }}
      </p>
      <button @click="reload">Neuladen</button>
    </portal>
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
  data() {
    return {
      error: ""
    }
  },
  middleware: ["auth"],
  mounted() {
    this.$nuxt.$on("modal:error", error => {
      this.error =
        error.message || error.response || "Error! Bitte Lade die Seite neu."
      this.$nuxt.$emit("modal:activate", "Ein Fehler ist aufgetreten")
    })
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
.app--layout {
  min-height: 100%;
  background-color: $grey-cod;
}
</style>
