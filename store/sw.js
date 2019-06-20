export const state = () => ({
  swRegistration: null,
  swInstalling: null,
  state: "",
  refreshing: false
})

export const mutations = {
  setRegistration: (state, swRegistration) => {
    state.swRegistration = swRegistration
  },
  setSwInstalling: (state, swInstalling) => {
    state.swInstalling = swInstalling
  },
  setState: (state, swState) => {
    state.state = swState
  },
  setRefreshing: (state, refreshing) => {
    state.refreshing = refreshing
  }
}

export const getters = {
  swRegistration: state => {
    return state.swRegistration
  },
  swInstalling: state => {
    return state.swInstalling
  },
  state: state => {
    return state.state
  },
  refreshing: state => {
    return state.refreshing
  }
}
