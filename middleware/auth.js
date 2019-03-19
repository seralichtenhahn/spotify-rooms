export default function({ store, redirect, query }) {
  if (store.state.user.loggedIn) {
    return
  }

  if (!query.code) {
    redirect("/")
  }
}
