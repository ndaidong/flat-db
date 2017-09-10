/**
 * FlatDB - Flat file based database
 * @ndaidong
 **/

var {
  copies
} = require('bellajs');

var {
  stabilize
} = require('stabilize.js');

var config = require('./configs');

var {
  fixPath,
  mkdir
} = require('./utils');

var {
  loadPersistentData,
  Collection,
  getCollection
} = require('./database');

var configure = (settings = {}) => {
  copies(settings, config, true);
  let {
    dir
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
  getCollection
};
