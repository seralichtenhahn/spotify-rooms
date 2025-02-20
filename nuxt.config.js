// Necessary require statement for importing env variables into nuxt.config.js
// https://github.com/nuxt-community/dotenv-module#using-env-file-in-nuxtconfigjs
require("dotenv").config()

const pkg = require("./package")

module.exports = {
  mode: "spa",

  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_FUNCTIONS_URI: process.env.FIREBASE_FUNCTIONS_URI
  },

  /*
  ** Headers of the page
  */
  head: {
    title: "Spotify Rooms",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#1db954" },

  loadingIndicator: {
    name: "circle",
    color: "#1db954",
    background: "#191414"
  },

  /*
  ** Global CSS
  */
  css: ["@/assets/scss/global.scss"],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "@/plugins/spotify.js",
    "@/plugins/firebase.js",
    "@/plugins/localStorage.js",
    "@/plugins/dayjs.js",
    "@/plugins/installSw.js",
    "@/plugins/nuxtClientInit.js"
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    "@nuxtjs/dotenv",
    "@nuxtjs/style-resources",
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "portal-vue/nuxt"
  ],

  /*
  ** Deafult SCSS Files import - requirments for all components
  */
  styleResources: {
    scss: ["~assets/scss/_toolbelt.scss"]
  },

  axios: {
    proxy: true // Can be also an object with default options
  },

  proxy: {
    "/.firebase/functions": {
      target: "http://localhost:5000/spotify-rooms-35887/us-central1",
      pathRewrite: { "^/.firebase/functions": "" },
      ws: false
    }
  },

  meta: {
    theme_color: "#191414"
  },

  manifest: {
    name: "Spotify Rooms",
    short_name: "Spotify Rooms",
    background_color: "#282828",
    lang: "de-CH"
  },

  workbox: {
    offlinePage: "200.html",
    //pagesURLPattern: "/(?!.*(__webpack_hmr|hot-update))",
    pagesURLPattern: "/(?!/.firebase/*)",
    autoRegister: false,
    skipWaiting: false,
    importScripts: ["/sw-message.js"]
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    postcss: {
      plugins: {
        "postcss-normalize": {}
      }
    },
    extend(config, ctx) {
      // update test for images & consider as images only files from folder assets/images/*
      config.module.rules
        .filter(r => r.test.toString().includes("svg"))
        .forEach(r => {
          r.test = /images\/.*\.(png|jpe?g|gif|svg)$/
        })
      // loader for inline svg from folder assets/icons/*
      config.module.rules.push({
        test: /icons\/.*\.svg$/,
        loader: "vue-svg-loader",
        options: {
          // optional [svgo](https://github.com/svg/svgo) options
          svgo: {
            plugins: [
              { removeDoctype: true },
              { removeComments: true },
              { removeViewBox: false },
              { removeTitle: true }
            ]
          }
        }
      })
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        })
      }
    }
  }
}
