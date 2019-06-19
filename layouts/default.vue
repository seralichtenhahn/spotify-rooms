<template>
  <div class="app--layout">
    <nuxt/>
    <StripeRoomInfo />
    <AppModal @hook:mounted="showErrorHandler" />
    <QueueHandler v-if="isOwner" />
    <FormUpdateBanner
      v-if="showUpdateBanner"
      @close-banner="closeUpdateBanner"
    />
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
    StripeRoomInfo,
    QueueHandler: () => import("@/components/Queue/QueueHandler"),
    FormUpdateBanner: () => import("@/components/Forms/FormUpdateBanner")
  },
  middleware: ["auth"],
  data() {
    return {
      showUpdateBanner: false
    }
  },
  computed: {
    ...mapGetters("error", ["showError", "error"]),
    ...mapGetters("currentRoom", ["isOwner"]),
    ...mapGetters("sw", ["state"])
  },
  watch: {
    showError: {
      immediate: true,
      handler: "showErrorHandler"
    },
    state(state) {
      if (state === "installed") {
        this.showRefreshUI()
      }
      if (state === "activated") {
        if (this.$store.getters["sw/refreshing"]) return
        window.location.reload()
        this.$store.commit("sw/setRefreshing", true)
      }
    }
  },
  mounted() {
    this.showRefreshUI()
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
    },
    showRefreshUI() {
      this.showUpdateBanner = true
      this.$nuxt.$emit("modal:activate", "Update verfügbar")
    },
    closeUpdateBanner() {
      this.showUpdateBanner = false
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
