import postcssNormalize from "postcss-normalize"

// Necessary require statement for importing env variables into nuxt.config.js
// https://github.com/nuxt-community/dotenv-module#using-env-file-in-nuxtconfigjs
require("dotenv").config()

const pkg = require("./package")

module.exports = {
  mode: "universal",

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
  plugins: [],

  /*
  ** Nuxt.js modules
  */
  modules: ["@nuxtjs/dotenv", "@nuxtjs/style-resources"],

  /*
  ** Deafult SCSS Files import - requirments for all components
  */
  styleResources: {
    scss: ["~assets/scss/_toolbelt.scss"]
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
