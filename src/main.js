/**
 * FlatDB - Flat file based database
 * @ndaidong
 **/

const {
  copies,
  clone,
} = require('bellajs');


const config = require('./configs');

const {
  fixPath,
  mkdir,
} = require('./utils');

const {
  loadPersistentData,
  Collection,
  getCollection,
} = require('./database');

const configure = (settings = {}) => {
  copies(settings, config, true);
  const {
    dir,
  } = config;

  const f = fixPath(dir);
  if (dir !== f) {
    config.dir = f;
  }

  mkdir(f);
  loadPersistentData();

  return clone(config);
};

module.exports = {
  configure,
  Collection,
  getCollection,
};
