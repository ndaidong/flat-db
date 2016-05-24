/**
 * FlatDB - Flat file based database
 * @ndaidong
 **/

require('promise.prototype.finally');

var bella = require('bellajs');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;
var mkdirp = require('mkdirp').sync;

var Collection = require('./collection');

const MAX_TEXT_LENG = 10000;

var _conf = {
  storeDir: '.flatdb-store/',
  maxTextLength: MAX_TEXT_LENG
};

var _collections = {};

var fixPath = (p = '') => {
  p = path.normalize(p);
  p += p.endsWith('/') ? '' : '/';
  return p;
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

var getDir = (name = '') => {
  return fixPath(_conf.storeDir + name);
};

var FlatDB = {
  configure: (opt = {}) => {
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
    if (bella.isNumber(mtl) && mtl > 0 && mtl < MAX_TEXT_LENG) {
      _conf.maxTextLength = mtl;
    }
    return _conf;
  },
  getConfigs: () => {
    return _conf;
  },
  addCollection: (col, schema) => {
    if (!isValidCol(col)) {
      throw new Error('Invalid collection name. Only alphabet and numbers are allowed.');
    }
    if (_collections[col]) {
      throw new Error('Duplicate collection. Please use another name.');
    }
    let name = bella.strtolower(col);
    let d = getDir(name);
    if (!fs.existsSync(d)) {
      mkdirp(d);
    }
    let c = new Collection(name, d, schema);
    _collections[name] = c;
    return c;
  },
  getCollection: (col) => {
    return getCollection(col);
  },
  removeCollection: (col) => {
    let c = getCollection(col);
    if (c) {
      let name = c.name;
      _collections[name] = null;
      delete _collections[name];
      return exec('rm -rf ' + c.dir);
    }
    return false;
  },
  emptyCollection: (col) => {
    let c = getCollection(col);
    if (c) {
      let d = c.dir;
      exec('rm -rf ' + d);
      return mkdirp(d);
    }
    return false;
  },
  reset: () => {
    let d = _conf.storeDir;
    if (fs.existsSync(d)) {
      _collections = {};
      exec('rm -rf ' + d);
      mkdirp(d);
    }
  }
};

module.exports = FlatDB;
