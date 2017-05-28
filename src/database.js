/**
 * FlatDB: Database
 * @ndaidong
 **/

var fs = require('fs');
var path = require('path');

var debug = require('debug');
var info = debug('flatdb:info');

var config = require('./configs');

var Collection = require('./collection');

var loadPersistentData = () => {

  let {
    dir,
    ext
  } = config;

  let dirs = fs.readdirSync(dir, 'utf8');
  if (dirs && dirs.length) {
    dirs.forEach((file) => {
      if (file.endsWith(ext)) {
        let fname = path.basename(file, ext);
        let c = new Collection(fname);
        if (c) {
          info(`Loaded persistent data for collection "${c.name}"`);
        }
      }
    });
  }

};

module.exports = {
  loadPersistentData,
  Collection
};
