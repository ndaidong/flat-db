/**
 * FlatDB - utils -> fixPath
 * @ndaidong
 **/

const {
  normalize,
} = require('path');

const fixPath = (p = '') => {
  return normalize(p);
};

module.exports = fixPath;
