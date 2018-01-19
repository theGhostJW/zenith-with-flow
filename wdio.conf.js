exports.config = {
  framework: 'mocha',
  mochaOpts: {
      timeout: 100000000
  }
}

// Cause all of our Selenium scripts to get transpiled by Babel in real-time into full ES6,
// running on Node.js. Allow generator calls to directly go through, since Node.js has efficient
// support for those.
require('babel-core/register')({
});
