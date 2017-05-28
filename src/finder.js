/**
 * FlatDB: Finder
 * @ndaidong
 **/

var {
  hasProperty,
  isString,
  isNumber
} = require('bellajs');

class Finder {

  constructor(entries = []) {
    this.entries = entries;
  }

  equals(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        return item[key] === val;
      }
      return false;
    });
    return this;
  }

  notEqual(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        return item[key] !== val;
      }
      return true;
    });
    return this;
  }

  gt(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        let a = item[key];
        if (isNumber(a)) {
          return a > val;
        }
      }
      return false;
    });
    return this;
  }

  gte(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        let a = item[key];
        if (isNumber(a)) {
          return a >= val;
        }
      }
      return false;
    });
    return this;
  }

  lt(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        let a = item[key];
        if (isNumber(a)) {
          return a < val;
        }
      }
      return false;
    });
    return this;
  }

  lte(key, val) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        let a = item[key];
        if (isNumber(a)) {
          return a <= val;
        }
      }
      return false;
    });
    return this;
  }

  matches(key, reg) {
    let entries = this.entries;
    this.entries = entries.filter((item) => {
      if (hasProperty(item, key)) {
        let a = item[key];
        if (isString(a)) {
          return a.match(reg) !== null;
        }
      }
      return false;
    });
    return this;
  }

  run() {
    return this.entries;
  }

}

module.exports = Finder;
