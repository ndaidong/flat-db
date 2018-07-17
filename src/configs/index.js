// config

const {error} = require('../utils/logger');

const env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
  'FLATDB_DIR',
].forEach((name) => {
  if (!env[name]) {
    error(`Environment variable ${name} is missing, use default instead.`);
  }
});

const config = {
  ENV: env.NODE_ENV || 'development',
  dir: env.FLATDB_DIR || './flatdb/',
  ext: '.fdb',
};
module.exports = config;
