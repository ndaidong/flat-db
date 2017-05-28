/**
 * FlatDB - utils -> delFile
 * @ndaidong
 **/

var {
  unlinkSync
} = require('fs');

let delFile = (f) => {
  return unlinkSync(f);
};

module.exports = delFile;
