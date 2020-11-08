/**
 * FlatDB: Database
 * @ndaidong
 **/

const {readdirSync} = require('fs');
const {basename} = require('path');

const {info} = require('./utils/logger');

const config = require('./configs');

const Collection = require('./collection');

const loadPersistentData = () => {
  const {
    dir,
    ext,
  } = config;

  const dirs = readdirSync(dir, 'utf8');
  if (dirs && dirs.length) {
    dirs.forEach((file) => {
      if (file.endsWith(ext)) {
        const fname = basename(file, ext);
        const c = new Collection(fname);
        if (c) {
          info(`Loaded persistent data for collection "${c.name}"`);
        }
      }
    });
  }
};

const getCollection = (n) => {
  return new Collection(n, false, true);
};

module.exports = {
  loadPersistentData,
  Collection,
  getCollection,
};
