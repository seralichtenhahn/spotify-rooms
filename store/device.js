import { detect } from "detect-browser"

export const state = () => ({
  breakpoint: "",
  browser: {}
})

export const getters = {
  breakpoint: store => store.breakpoint,
  isMobile: store =>
    store.breakpoint === "small" || store.breakpoint === "default",
  isMobileOrTablet: store =>
    store.breakpoint === "small" || store.breakpoint === "medium",
  isDesktop: store =>
    store.breakpoint !== "small" && store.breakpoint !== "medium",
  isEdge: store => store.browser.name === "edge"
}

export const mutations = {
  setCurrentBreakpoint(state) {
    state.breakpoint = window
      .getComputedStyle(document.querySelector("body"), ":before")
      .getPropertyValue("content")
      .replace(/\"|\'/g, "")
  },
  setBrowser(state, browser) {
    state.browser = browser
  }
}

export const actions = {
  init({ commit }) {
    const browser = detect()
    commit("setBrowser", browser)

    commit("setCurrentBreakpoint")
    window.addEventListener("resize", () => {
      commit("setCurrentBreakpoint")
    })
    window.addEventListener("orientationchange", () => {
      commit("setCurrentBreakpoint")
    })
  }
}
