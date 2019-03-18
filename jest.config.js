module.exports = {
  moduleFileExtensions: ["js", "json", "vue"],
  transform: {
    "^.+\\.js$": "<rootDir>/node_modules/babel-jest",
    ".*\\.(vue)$": "vue-jest"
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1"
  },
  collectCoverage: false,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"]
}
