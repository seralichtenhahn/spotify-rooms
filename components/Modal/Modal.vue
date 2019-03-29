<template>
  <transition name="modal">
    <div
      v-if="active"
      class="modal-mask"
    >
      <div class="modal-wrapper">
        <div class="modal-header">
          {{ title }}
        </div>
        <div class="modal-body">
          <portal-target name="modal" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      active: false
    }
  },
  /**
   * Erstellt Hörer für Event modal:activate
   * Setzt Titel und aktiviert Modal falls Event aufgerufen wird
   * Erstellt Hörer für Event modal:deactivate
   * Deaktiviert Modal falls Event aufgerufen wird
   */
  created() {
    this.$nuxt.$on("modal:activate", title => {
      this.title = title
      this.active = true
    })

    this.$nuxt.$on("modal:deactivate", () => {
      this.title = ""
      this.active = false
    })
  }
}
</script>

<style lang="scss">
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba($black, 0.5);
}

.modal-wrapper {
  width: 100%;
  max-width: rem(640);
  border-radius: rem(7);
  margin: 0 rem($padding--side);
  background-color: $grey-mine;
  box-shadow: 0 rem(2) rem(8) rgba(0, 0, 0, 0.33);
}

.modal-header {
  padding: rem(16) rem($padding--side);
  border-bottom: rem(1) solid $grey-cod;
  margin-top: 0;
  color: $white;
  font-weight: 600;
  letter-spacing: rem(0.33);
  text-align: center;
}

.modal-body {
  padding: rem(16) rem($padding--side);
  margin: rem(20) 0;
  text-align: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 250ms ease-in-out;

  .modal-wrapper {
    transition: transform 250ms ease-in-out;
  }
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-wrapper {
    transform: translateY(100%);
  }
}
</style>
