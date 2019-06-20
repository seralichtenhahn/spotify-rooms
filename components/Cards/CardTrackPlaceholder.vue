<template>
  <li
    class="track--card-placeholder"
    @click="$emit('placeholder-click')"
  >
    <IconAddCircle class="icon" />
    <h3>Neuen Track hinzufügen</h3>
  </li>
</template>

<script>
import IconAddCircle from "@/assets/icons/add-circle-outline.svg"

export default {
  components: {
    IconAddCircle
  }
}
</script>

<style lang="scss">
.track--card-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: rem(12 16 12);
  border-radius: rem(5);
  margin-bottom: rem(20);
  color: $white;
  background-color: $grey-mine;
  cursor: pointer;

  .icon {
    width: rem(64);
    height: rem(64);
    color: rgba($white, 0.3);
    margin-bottom: rem(12);
  }
}
</style>
