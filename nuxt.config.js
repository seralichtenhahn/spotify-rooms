import postcssNormalize from "postcss-normalize"

// Necessary require statement for importing env variables into nuxt.config.js
// https://github.com/nuxt-community/dotenv-module#using-env-file-in-nuxtconfigjs
require("dotenv").config()

const pkg = require("./package")

console.log(SPOTIFY_REDIRECT_URI)
console.log(process.env.DEPLOY_PRIME_URI)

module.exports = {
  mode: "spa",

  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    NETLIFY_FUNCTIONS_URI: process.env.NETLIFY_FUNCTIONS_URI
  },

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#FFFFFF" },

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
    "@/plugins/nuxtClientInit.js"
  ],

  /*
  ** Nuxt.js modules
  */
  modules: ["@nuxtjs/dotenv", "@nuxtjs/style-resources", "@nuxtjs/axios"],

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
    "/.netlify/functions": {
      target: "http://localhost:9000",
      pathRewrite: { "^/.netlify/functions": "" },
      ws: false
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    postcss: [postcssNormalize()],
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
