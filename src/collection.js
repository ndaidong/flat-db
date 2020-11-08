/**
 * FlatDB: Collection
 * @ndaidong
 **/

const {
  time,
  genid,
  hasProperty,
  isObject,
  isArray,
  isEmpty,
  isString,
} = require('bellajs');

const {
  fixPath,
  readFile,
  delFile,
  writeFile,
  normalize,
  logger,
} = require('./utils');

const {info} = logger;

const config = require('./configs');

const Finder = require('./finder');


const C = new Map();

class Collection {
  constructor(name, schema = {}, forceReload = false) {
    const n = normalize(name);
    if (!n) {
      throw new Error(`Invalid collection name "${name}"`);
    }

    if (!forceReload) {
      const c = C.get(n);
      if (c) {
        return c;
      }
    }

    this.name = n;
    this.schema = schema;

    this.lastModified = time();
    this.entries = [];

    const {
      dir,
      ext,
    } = config;

    const file = fixPath(`${dir}/${n}${ext}`);

    this.file = file;

    this.status = 0;

    const data = readFile(file);
    if (data) {
      const {
        schema: cschema,
        lastModified,
        entries,
      } = data;

      this.schema = isEmpty(schema) ? cschema : schema;
      this.lastModified = lastModified;
      this.entries = entries;
    }

    C.set(n, this);

    return this;
  }

  onchange() {
    const lastModified = time();
    this.lastModified = lastModified;
    writeFile(this.file, {
      name: this.name,
      lastModified,
      schema: this.schema,
      entries: this.all(),
    });
  }

  all() {
    return [...this.entries];
  }

  count() {
    return this.entries.length;
  }

  add(item) {
    if (!isObject(item) && !isArray(item)) {
      throw new Error('Invalid parameter. Object required.');
    }

    const entries = this.all();

    const schema = this.schema;
    const noSchema = isEmpty(schema);

    const addOne = (entry) => {
      const id = genid(32);
      entry._id_ = id;
      entry._ts_ = time();

      if (!noSchema) {
        const _item = Object.assign({
          _id_: '',
          _ts_: 0,
        }, schema);
        for (const key in _item) {
          if (hasProperty(entry, key) && typeof entry[key] === typeof _item[key]) {
            _item[key] = entry[key];
          }
        }
        entry = _item;
      }
      return entry;
    };

    if (!isArray(item)) {
      const newEntry = addOne(item);
      this.entries.push(newEntry);
      this.onchange();
      return newEntry._id_;
    }

    const newEntries = item.map(addOne);
    this.entries = entries.concat(newEntries);
    this.onchange();
    return newEntries.map((a) => {
      return a._id_;
    });
  }

  get(id) {
    if (!isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }

    const entries = this.all();

    const candidates = entries.filter((item) => {
      return item._id_ === id;
    });

    return candidates.length > 0 ? candidates[0] : null;
  }

  update(id, data) {
    if (!isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }

    const entries = this.all();
    let changed = false;

    const k = entries.findIndex((el) => {
      return el._id_ === id;
    });

    if (k >= 0) {
      const obj = entries[k];

      for (const key in obj) {
        if (key !== '_id_' &&
              hasProperty(data, key) &&
                typeof data[key] === typeof obj[key] &&
                  data[key] !== obj[key]) {
          obj[key] = data[key];
          changed = true;
        }
      }

      if (!changed) {
        info('Nothing to update');
        return false;
      }

      obj._ts_ = time();
      entries[k] = obj;
      this.onchange();
      info(`Updated an item: ${id}`);
      return obj;
    }

    return false;
  }

  remove(id) {
    if (!isString(id)) {
      throw new Error('Invalid parameter. String required.');
    }

    const entries = this.all();
    const k = entries.findIndex((el) => {
      return el._id_ === id;
    });

    if (k >= 0) {
      entries.splice(k, 1);
      this.entries = entries;
      this.onchange();
      info(`Removed an item: ${id}`);
      return true;
    }

    return false;
  }

  find() {
    return new Finder(this.all());
  }

  reset() {
    this.lastModified = time();
    this.entries = [];
    delFile(this.file);
  }
}

module.exports = Collection;
