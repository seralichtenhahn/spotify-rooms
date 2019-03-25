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
  mounted() {
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
@media screen and (prefers-reduced-motion: reduce) {
  .modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9998;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: none;
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

@media screen and (prefers-reduced-motion: reduce) {
  .modal-wrapper {
    width: rem(300);
    padding: rem(20) rem(30);
    border-radius: rem(2);
    margin: 0 auto;
    font-family: Helvetica, Arial, sans-serif;
    background-color: #fff;
    box-shadow: 0 rem(2) rem(8) rgba(0, 0, 0, 0.33);
    transition: none;
  }
}

.modal-wrapper {
  width: rem(300);
  padding: rem(20) rem(30);
  border-radius: rem(2);
  margin: 0 auto;
  font-family: Helvetica, Arial, sans-serif;
  background-color: #fff;
  box-shadow: 0 rem(2) rem(8) rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: rem(20) 0;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  transform: scale(1.1);
}
</style>
