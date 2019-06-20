export default ({ store, isDev }) => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(isDev ? "/sw-dev.js" : "/sw.js")
      .then(registration => {
        // Registration was successful
        store.commit("sw/setRegistration", registration)

        registration.addEventListener("updatefound", () => {
          // An updated service worker has appeared in reg.installing!
          const newWorker = registration.installing
          store.commit("sw/setSwInstalling", newWorker)

          newWorker.addEventListener("statechange", () => {
            // There is a new service worker available, show the notification
            if (navigator.serviceWorker.controller) {
              store.commit("sw/setState", newWorker.state)
            }
          })
        })
      })
      .catch(err => {
        // registration failed :(
        console.log("ServiceWorker registration failed: ", err)
      })
  }
}
