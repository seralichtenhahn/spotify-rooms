import createPersistedState from "vuex-persistedstate"

export default ({ store }) => {
  createPersistedState({
    key: "auth",
    paths: ["auth", "voting"]
  })(store)
}
