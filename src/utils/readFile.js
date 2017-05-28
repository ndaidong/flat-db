/**
 * FlatDB - utils -> readFile
 * @ndaidong
 **/

var {
  existsSync,
  readFileSync
} = require('fs');

var debug = require('debug');
var error = debug('flatdb:error');

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
