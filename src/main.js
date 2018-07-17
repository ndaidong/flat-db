/**
 * FlatDB - Flat file based database
 * @ndaidong
 **/

const {
  copies,
} = require('bellajs');

const {
  stabilize,
} = require('stabilize.js');

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
  let {
    dir,
  } = config;

  let f = fixPath(dir);
  if (dir !== f) {
    config.dir = f;
  }

  mkdir(f);
  loadPersistentData();

  return stabilize(config);
};

module.exports = {
  configure,
  Collection,
  getCollection,
};
