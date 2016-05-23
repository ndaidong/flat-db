/**
 * FlatDB: Collection
 * @ndaidong
 **/

var bella = require('bellajs');
var fs = require('fs');

const EXT = '.fdb';

var getColData = (f) => {
  return new Promise((resolve, reject) => {
    let noop = {
      updatedAt: bella.time(),
      entries: []
    };
    if (!fs.existsSync(f)) {
      return resolve(noop);
    }
    return fs.readFile(f, 'utf8', (err, content) => {
      if (err) {
        return reject(err);
      }
      try {
        let o = JSON.parse(content);
        if (o) {
          return resolve(o);
        }
        return resolve(noop);
      } catch (e) {
        return resolve(noop, e);
      }
    });
  });
};

var setColData = (data, f) => {
  if (!fs.existsSync(f)) {
    throw new Error('Missing collection file data while processing');
  }
  let s = bella.isString(data) ? data : JSON.stringify(data);
  return fs.writeFileSync(f, s, 'utf8');
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

  constructor(name, dir, schema) {
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
    return new Promise((resolve, reject) => {
      let file = this.file;
      return getColData(file).then((data) => {
        let c = data.entries || [];
        let id = bella.createId(32);
        item._id_ = id;
        item._ts_ = bella.time();
        c.unshift(item);
        data.entries = c;
        setColData(data, file);
        return resolve(id);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  get(id, fields) {
    if (!bella.isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }
    return new Promise((resolve, reject) => {
      let file = this.file;
      return getColData(file).then((data) => {
        let c = data.entries || [];
        let item;
        for (let i = 0; i < c.length; i++) {
          let m = c[i];
          if (m._id_ === id) {
            item = clean(m, fields);
            break;
          }
        }
        return resolve(item || null);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  remove(id) {
    if (!bella.isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }
    return new Promise((resolve, reject) => {
      let file = this.file;
      return getColData(file).then((data) => {
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
        data.entries = c;
        setColData(data, file);
        return resolve(item);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

}

module.exports = Collection;
