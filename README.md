# Spotify Rooms (IPA Project)

[![CircleCI](https://circleci.com/gh/seralichtenhahn/spotify-rooms.svg?style=svg)](https://circleci.com/gh/seralichtenhahn/spotify-rooms)

[![Netlify Status](https://api.netlify.com/api/v1/badges/597ea606-1b7b-4320-b5b8-5e4fecd2bdca/deploy-status)](https://app.netlify.com/sites/spotify-rooms/deploys)

> Repository für die IPA von Serafin Lichtenhahn 

## First Steps

1. clone Repo
2. edit `name, description, author` in `package.json`
3. run `$ yarn` in root folder


## Development

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

``` bash
# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

## Linting

``` bash
# check for style errors/problems
$ yarn lint:scss

# autofix all possible style problems
$ yarn lint:scss --fix

# check for VUE errors/problems
$ yarn lint:vue

# autofix all possible vue problems
$ yarn lint:vue --fix

# check for all errors and probelems
$ yarn lint
```

## Normalize CSS

For normalizing of CSS is used `postcss-normalize` pluging, which takes in consideration the *browserlist* from `package.json`.

The normalize css will be imported using the `@import-normalize` statement in `global.scss` file.


## Upgrade NPM Packages

For update use `ncu` - [npm-check-updates](https://www.npmjs.com/package/npm-check-updates)

Do NOT update following packages: 

- eslint-config-prettier
- eslint-plugin-prettier
- eslint-plugin-vue
- prettier

``` bash
# check which packages are possible to update
$ ncu

# update concrete packages
$ ncu -u package-name

# always test if the template is working after upgrade
$ yarn dev
```
