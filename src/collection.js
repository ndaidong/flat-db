/**
 * FlatDB: Collection
 * @ndaidong
 **/

var bella = require('bellajs');

var fs = require('fs');

var Finder = require('./finder');

const EXT = '.fdb';

var getColData = (f) => {
  let noop = {
    updatedAt: bella.time(),
    entries: []
  };
  if (!fs.existsSync(f)) {
    return noop;
  }

  let s = fs.readFileSync(f, 'utf8');
  if (!s) {
    return noop;
  }
  return JSON.parse(s);
};

var setColData = (data = {}, f) => {
  let o = {
    updatedAt: bella.time(),
    entries: data.entries || []
  };
  return fs.writeFileSync(f, JSON.stringify(o), 'utf8');
};

var clean = (data, fields = []) => {
  let keys = [];
  if (bella.isString(fields)) {
    keys = fields.split(' ');
  }
  let o = Object.assign({}, data);
  if (keys.length > 0) {
    let a = {};
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      a[k] = o[k];
    }
    o = a;
  }
  return o;
};

class Collection {

  constructor(name, dir, schema = {}) {
    let file = dir + name + EXT;
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '', 'utf8');
    }
    this.name = name;
    this.dir = dir;
    this.file = file;
    this.schema = schema;
  }

  add(item) {
    if (!bella.isObject(item)) {
      throw new Error('Invalid parameter. Object required.');
    }
    let file = this.file;
    let data = getColData(file);
    let c = data.entries || [];
    let id = bella.createId(32);
    item._id_ = id;
    item._ts_ = bella.time();
    c.unshift(item);
    data.entries = c;
    setColData(data, file);
    return id;
  }

  get(id, fields) {
    let file = this.file;
    let data = getColData(file);
    let c = data.entries || [];

    if (!id) {
      return c;
    }
    if (!bella.isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }

    let item;
    for (let i = 0; i < c.length; i++) {
      let m = c[i];
      if (m._id_ === id) {
        item = clean(m, fields);
        break;
      }
    }
    return item || null;
  }

  update(id, obj) {
    if (!bella.isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }
    let file = this.file;
    let data = getColData(file);
    let c = data.entries || [];
    let item;
    for (let i = 0; i < c.length; i++) {
      let m = c[i];
      if (m._id_ === id) {
        item = bella.copies(obj, m, true, ['_id_', '_ts_']);
        c.splice(i, 1, item);
        break;
      }
    }

    if (item) {
      data.entries = c;
      setColData(data, file);
    }
    return item;
  }

  remove(id) {
    if (!bella.isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }
    let file = this.file;
    let data = getColData(file);
    let c = data.entries || [];
    let item;
    for (let i = c.length - 1; i >= 0; i--) {
      let m = c[i];
      if (m._id_ === id) {
        item = m;
        c.splice(i, 1);
        break;
      }
    }
    if (item) {
      data.entries = c;
      setColData(data, file);
      return item;
    }
    return false;
  }

  find() {
    let file = this.file;
    let data = getColData(file);
    let c = data.entries || [];
    return new Finder(c);
  }

}

module.exports = Collection;
