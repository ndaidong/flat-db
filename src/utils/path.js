/**
 * FlatDB - utils -> fixPath
 * @ndaidong
 **/

var path = require('path');

var fixPath = (p = '') => {
  return path.normalize(p);
};

module.exports = fixPath;
