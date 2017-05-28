/**
 * FlatDB - utils -> writeFile
 * @ndaidong
 **/

var {
  writeFileSync
} = require('fs');

var {
  isString
} = require('bellajs');

let writeFile = (f, data = '') => {
  let content = isString(data) ? data : JSON.stringify(data);
  return writeFileSync(f, content, 'utf8');
};

module.exports = writeFile;
