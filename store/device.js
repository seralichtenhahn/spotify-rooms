export const state = () => ({
  breakpoint: ""
})

export const getters = {
  breakpoint: store => store.breakpoint,
  isMobile: store => store.breakpoint === "small",
  isMobileOrTablet: store =>
    store.breakpoint === "small" || store.breakpoint === "medium",
  isDesktop: store =>
    store.breakpoint !== "small" && store.breakpoint !== "medium"
}

export const mutations = {
  setCurrentBreakpoint(store) {
    store.breakpoint = window
      .getComputedStyle(document.querySelector("body"), ":before")
      .getPropertyValue("content")
      .replace(/\"|\'/g, "")
  }
}

export const actions = {
  init({ commit }) {
    commit("setCurrentBreakpoint")
    window.addEventListener("resize", () => {
      commit("setCurrentBreakpoint")
    })
    window.addEventListener("orientationchange", () => {
      commit("setCurrentBreakpoint")
    })
  }
}
