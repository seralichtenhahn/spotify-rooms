export default context => {
  if (process.client) {
    context.store.dispatch("nuxtClientInit", context)
  }
}
