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
    store.commit("auth/accessToken", "")
    store.commit("auth/expiresIn", 0)

    return redirect("/")
  }
}
</script>
