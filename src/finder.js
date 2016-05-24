/**
 * FlatDB: Finder
 * @ndaidong
 **/

var bella = require('bellajs');

class Finder {

  constructor(entries = []) {
    this.entries = entries;
  }

  equals(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        return item[key] === val;
      }
      return false;
    });
    return this;
  }

  notEqual(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        return item[key] !== val;
      }
      return true;
    });
    return this;
  }

  includes(key, val, ignorecase) {
    if (ignorecase) {
      key = bella.strtolower(key);
    }
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        let a = item[key];
        if (bella.isString(a)) {
          if (ignorecase) {
            a = bella.strtolower(a);
          }
          return a.includes(val);
        }
      }
      return false;
    });
    return this;
  }

  notInclude(key, val, ignorecase) {
    if (ignorecase) {
      key = bella.strtolower(key);
    }
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        let a = item[key];
        if (bella.isString(a)) {
          if (ignorecase) {
            a = bella.strtolower(a);
          }
          return !a.includes(val);
        }
      }
      return true;
    });
    return this;
  }

  gt(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        let a = item[key];
        if (bella.isNumber(a)) {
          return a > val;
        }
      }
      return false;
    });
    return this;
  }

  lt(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        let a = item[key];
        if (bella.isNumber(a)) {
          return a < val;
        }
      }
      return false;
    });
    return this;
  }

  matches(key, reg) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (bella.hasProperty(item, key)) {
        let a = item[key];
        if (bella.isString(a)) {
          return a.match(reg) !== null;
        }
      }
      return false;
    });
    return this;
  }

  execute() {
    return Promise.resolve(this.entries);
  }

}

module.exports = Finder;
