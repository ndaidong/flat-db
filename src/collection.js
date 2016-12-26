/**
 * FlatDB: Collection
 * @ndaidong
 **/

var bella = require('bellajs');

var fs = require('fs');

var fixPath = require('./utils/path');

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

var def = (o, key, val, opt = {}) => {
  let {
    enumerable = false,
    configurable = false,
    writable = false,
    value = val
  } = opt;
  Object.defineProperty(o, key, {
    enumerable,
    configurable,
    writable,
    value
  });
  return o;
};

var defineSchema = (props) => {
  let conf = {
    writable: false,
    enumerable: false,
    configurable: false
  };

  let schema = {};
  for (let key in props) {
    if (props.hasOwnProperty(key)) {
      let value = props[key];
      schema = def(schema, key, value, conf);
    }
  }

  return schema;
};

class Collection {

  constructor(name, dir, schema = {}) {
    let file = fixPath(dir + '/' + name + EXT);
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '', 'utf8');
    }
    this.name = name;
    this.dir = dir;
    this.file = file;
    this.schema = defineSchema(schema);
  }

  add(item) {
    if (!bella.isObject(item) && !bella.isArray(item)) {
      throw new Error('Invalid parameter. Object required.');
    }
    let entries = bella.isArray(item) ? item : [item];

    let file = this.file;
    let data = getColData(file);
    let currentEntries = data.entries || [];
    let schema = this.schema;
    let noSchema = bella.isEmpty(schema);

    let added = [];

    entries.map((entry) => {
      let id = bella.createId(32);
      added.push(id);
      entry._id_ = id;
      entry._ts_ = bella.time();

      if (!noSchema) {
        let _item = Object.assign({}, schema);
        for (let key in entry) {
          if (bella.hasProperty(item, key)) {
            _item[key] = entry[key];
          }
        }
        entry = _item;
      }
      currentEntries.unshift(entry);
      return entry;
    });

    data.entries = currentEntries;
    setColData(data, file);

    return added.length === 1 ? added[0] : added;
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
