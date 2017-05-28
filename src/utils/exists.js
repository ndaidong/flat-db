/**
 * FlatDB - utils -> fsExist
 * @ndaidong
 **/

var fs = require('fs');

let fsExist = (f) => {
  return fs.existsSync(f);
};

module.exports = fsExist;
