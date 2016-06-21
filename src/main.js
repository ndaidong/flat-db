/**
 * FlatDB - Flat file based database
 * @ndaidong
 **/

var bella = require('bellajs');
var fs = require('fs');
var exec = require('child_process').execSync;
var mkdirp = require('mkdirp').sync;

var fixPath = require('./utils/path');

var Collection = require('./collection');

const MIN_TEXT_LENG = 0;
const MAX_TEXT_LENG = 10000;

var _conf = {
  storeDir: '.flatdb-store/',
  maxTextLength: MAX_TEXT_LENG
};

var _collections = {};

var getDir = (name = '') => {
  return fixPath(_conf.storeDir + '/' + name);
};

var isValidCol = (name = '') => {
  let re = /^([A-Z_])+([_A-Z0-9])+$/i;
  return bella.isString(name) && re.test(name);
};

var getCollection = (name = '') => {
  if (!isValidCol(name)) {
    throw new Error('Invalid collection name. Only alphabet and numbers are allowed.');
  }
  let col = bella.strtolower(name);
  let c = _collections[col] || false;
  return c;
};

var emptyCollection = (col) => {
  let c = getCollection(col);
  if (c) {
    let d = c.dir;
    exec(`rm -rf ${d}`);
    return mkdirp(d);
  }
  return false;
};

var removeCollection = (col) => {
  let c = getCollection(col);
  if (c) {
    let name = c.name;
    _collections[name] = null;
    delete _collections[name];
    return exec(`rm -rf ${c.dir}`);
  }
  return false;
};

var addCollection = (col, schema) => {
  if (!isValidCol(col)) {
    throw new Error('Invalid collection name. Only alphabet and numbers are allowed.');
  }
  if (_collections[col]) {
    return _collections[col];
  }

  let name = bella.strtolower(col);
  let d = getDir(name);
  if (!fs.existsSync(d)) {
    mkdirp(d);
  }
  let c = new Collection(name, d, schema);
  _collections[name] = c;
  return c;
};

var loadPersistentData = () => {
  let sd = _conf.storeDir;
  let dirs = fs.readdirSync(sd, 'utf8');
  if (dirs && dirs.length) {
    dirs.forEach((item) => {
      let d = item.toLowerCase();
      let p = fixPath(sd + '/' + d);
      let c = new Collection(d, p);
      _collections[d] = c;
    });
  }
};

var configure = (opt = {}) => {
  let p = opt.path || _conf.storeDir;
  if (p && bella.isString(p)) {
    let d = fixPath(p);
    _conf.storeDir = d;
  }
  let t = _conf.storeDir;
  if (!fs.existsSync(t)) {
    mkdirp(t);
  }
  let mtl = opt.maxTextLength;
  if (bella.isNumber(mtl) && mtl > MIN_TEXT_LENG && mtl < MAX_TEXT_LENG) {
    _conf.maxTextLength = mtl;
  }

  loadPersistentData();
  return _conf;
};

var FlatDB = {
  configure(opt) {
    return configure(opt);
  },
  getConfigs() {
    return _conf;
  },
  addCollection(col, schema) {
    return addCollection(col, schema);
  },
  getCollection(name) {
    return getCollection(name);
  },
  removeCollection(name) {
    return removeCollection(name);
  },
  emptyCollection(name) {
    return emptyCollection(name);
  },
  reset() {
    _collections = Object.create(null);
    let d = _conf.storeDir;
    exec(`rm -rf ${d}`);
    exec(`mkdir ${d}`);
  }
};

module.exports = FlatDB;
