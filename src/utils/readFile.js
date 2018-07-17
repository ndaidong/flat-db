/**
 * FlatDB - utils -> readFile
 * @ndaidong
 **/

const {
  existsSync,
  readFileSync,
} = require('fs');

const {error} = require('./logger');

let readFile = (f) => {
  if (existsSync(f)) {
    let s = readFileSync(f, 'utf8');
    try {
      let c = JSON.parse(s);
      return c;
    } catch (err) {
      error(err);
    }
  }
  return null;
};

module.exports = readFile;
