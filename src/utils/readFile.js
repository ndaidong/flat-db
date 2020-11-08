/**
 * FlatDB - utils -> readFile
 * @ndaidong
 **/

const {
  existsSync,
  readFileSync,
} = require('fs');

const {error} = require('./logger');

const readFile = (f) => {
  if (existsSync(f)) {
    const s = readFileSync(f, 'utf8');
    try {
      const c = JSON.parse(s);
      return c;
    } catch (err) {
      error(err);
    }
  }
  return null;
};

module.exports = readFile;
