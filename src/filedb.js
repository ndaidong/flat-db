/**
 * FileDB - Flat file based database
 * @ndaidong
 **/

var bella = require('bellajs');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var _storeDir = './';
var _collections = [];

var fixPath = (p) => {
  if (!p) {
    return '';
  }
  p = path.normalize(p);
  p += p.endsWith('/') ? '' : '/';
  return p;
};

class Collection {
  constructor(name, dir) {
    this.name = name;
    this.dir = dir;
  }
}

var FileDB = {
  config: (opt) => {
    let d = fixPath(opt.path);
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d);
      _storeDir = d;
    }
  },
  addCollection: (col) => {
    let name = bella.strtolower(col);
    let d = fixPath(_storeDir + name);
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d);
      let c = new Collection(name, d);
      _collections.push(c);
      return c;
    }
    return false;
  },
  removeCollection: (col) => {
    let name = bella.strtolower(col);
    let d = fixPath(_storeDir + name);
    if (!fs.existsSync(d)) {
      return exec('rm -rf ' + d);
    }
    return false;
  },
  emptyCollection: (col) => {
    let name = bella.strtolower(col);
    let d = fixPath(_storeDir + name);
    if (!fs.existsSync(d)) {
      exec('rm -rf ' + d);
      return fs.mkdirSync(d);
    }
    return false;
  }
};

module.exports = FileDB;
