/**
 * FlatDB - utils -> normalize
 * @ndaidong
 **/

var {isString} = require('bellajs');

var isValidCol = (name = '') => {
  let re = /^([A-Z_])+([_A-Z0-9])+$/i;
  return isString(name) && re.test(name);
};

let normalize = (name) => {
  if (isValidCol(name)) {
    return name.toLowerCase();
  }
  return false;
};

module.exports = normalize;
