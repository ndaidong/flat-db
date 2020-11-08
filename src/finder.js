/**
 * FlatDB: Finder
 * @ndaidong
 **/

const {
  hasProperty,
  isString,
  isNumber,
  isInteger,
} = require('bellajs');

class Finder {
  constructor(entries = []) {
    this.entries = entries;
    this._skip = 0;
    this._limit = entries.length;
  }

  equals(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        return item[key] === val;
      }
      return false;
    });
    return this;
  }

  notEqual(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        return item[key] !== val;
      }
      return true;
    });
    return this;
  }

  gt(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        const a = item[key];
        if (isNumber(a)) {
          return a > val;
        }
      }
      return false;
    });
    return this;
  }

  gte(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        const a = item[key];
        if (isNumber(a)) {
          return a >= val;
        }
      }
      return false;
    });
    return this;
  }

  lt(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        const a = item[key];
        if (isNumber(a)) {
          return a < val;
        }
      }
      return false;
    });
    return this;
  }

  lte(key, val) {
    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        const a = item[key];
        if (isNumber(a)) {
          return a <= val;
        }
      }
      return false;
    });
    return this;
  }

  matches(key, reg) {
    if (isString(reg)) {
      reg = reg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        const a = item[key];
        if (isString(a)) {
          return a.match(reg) !== null;
        }
      }
      return false;
    });
    return this;
  }

  skip(k) {
    if (isInteger(k)) {
      this._skip = k;
    }
    return this;
  }

  limit(k) {
    if (isInteger(k)) {
      this._limit = k;
    }
    return this;
  }

  run() {
    let entries = this.entries;
    const skip = this._skip;
    const limit = this._limit;
    const leng = entries.length;
    if (skip > 0 && skip < leng) {
      entries = entries.slice(skip, leng);
    }
    if (limit > 0 && limit < entries.length) {
      entries = entries.slice(0, limit);
    }
    return entries;
  }
}

module.exports = Finder;
