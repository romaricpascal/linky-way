module.exports = {
  // Mocha uses Yargs as a way to configure itself
  // so for passing the glob for the test
  // we need to use the `_` key
  _: "src/**/*--test.js",
  // We want to watch all files, not just the test
  // ones
  "watch-files": ["src/**/*.js"]
}
