<template>
  <div class="app--layout">
    <nuxt/>
    <StripeRoomInfo />
    <AppModal @hook:mounted="showErrorHandler" />
    <portal
      v-if="showError"
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
import { mapGetters } from "vuex"

export default {
  components: {
    AppModal,
    StripeRoomInfo
  },
  middleware: ["auth"],
  computed: {
    ...mapGetters("error", ["showError", "error"])
  },
  watch: {
    showError: {
      immediate: true,
      handler: "showErrorHandler"
    }
  },
  methods: {
    /**
     * Setzt Wert von ExpireIn auf 1
     * Ladet die Seite neu
     */
    reload() {
      this.$store.commit("auth/setExpiresIn", 1)
      window.location.reload()
    },
    /**
     * Aktiviert falls showError wahr ist, das Modal mit dem Titel "Ein Fehler ist aufgetreten"
     */
    showErrorHandler(showError) {
      if (showError || this.showError) {
        this.$nuxt.$emit("modal:activate", "Ein Fehler ist aufgetreten")
      }
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
