export const state = () => ({
  showError: false,
  error: ""
})

export const getters = {
  showError: store => store.showError,
  error: store => store.error
}

export const mutations = {
  setError(state, error) {
    state.error = error
  },
  setShowError(state, showError) {
    state.showError = showError
  }
}

export const actions = {
  create({ commit }, error) {
    let message
    if (error.response) {
      const response = JSON.parse(error.response)
      message = response.error.message
    } else {
      message = error.message || "Error! Bitte Lade die Seite neu."
    }

    console.log(message)

    commit("setError", message)
    commit("setShowError", true)
  }
}
