<template>
  <div class="row--inner">
    <h1>
      Logout
    </h1>
  </div>
</template>

<script>
export default {
  async fetch({ redirect, store }) {
    store.commit("user/setLoginStatus", false)
    store.commit("auth/setAccessToken", "")
    store.commit("auth/setExpiresIn", 0)

    return redirect("/")
  }
}
</script>
