/**
 * FlatDB - utils -> writeFile
 * @ndaidong
 **/

const {
  writeFileSync,
} = require('fs');

const {
  isString,
} = require('bellajs');

const writeFile = (f, data = '') => {
  const content = isString(data) ? data : JSON.stringify(data);
  return writeFileSync(f, content, 'utf8');
};

module.exports = writeFile;
