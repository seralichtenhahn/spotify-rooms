<template>
  <div class="row">
    <h1>
      Rooms
    </h1>
    <p>
      <strong>User:</strong>{{ username }}
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"

export default {
  computed: {
    ...mapGetters("user", ["username"])
  }
}
</script>
