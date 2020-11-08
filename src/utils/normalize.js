/**
 * FlatDB - utils -> normalize
 * @ndaidong
 **/

const {
  isString,
} = require('bellajs');

const isValidCol = (name = '') => {
  const re = /^([A-Z_])+([_A-Z0-9])+$/i;
  return isString(name) && re.test(name);
};

const normalize = (name) => {
  if (isValidCol(name)) {
    return name.toLowerCase();
  }
  return false;
};

module.exports = normalize;
