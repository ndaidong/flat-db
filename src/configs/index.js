// config

var debug = require('debug');
var error = debug('flatdb:error');

var env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
  'FLATDB_DIR'
].forEach((name) => {
  if (!env[name]) {
    error(`Environment variable ${name} is missing, use default instead.`);
  }
});

var config = {
  ENV: env.NODE_ENV || 'development',
  dir: env.FLATDB_DIR || './flatdb/',
  ext: '.fdb'
};
module.exports = config;
