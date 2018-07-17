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
  let {
    dir,
    ext,
  } = config;

  let dirs = readdirSync(dir, 'utf8');
  if (dirs && dirs.length) {
    dirs.forEach((file) => {
      if (file.endsWith(ext)) {
        let fname = basename(file, ext);
        let c = new Collection(fname);
        if (c) {
          info(`Loaded persistent data for collection "${c.name}"`);
        }
      }
    });
  }
};

let getCollection = (n) => {
  return new Collection(n, false, true);
};

module.exports = {
  loadPersistentData,
  Collection,
  getCollection,
};
