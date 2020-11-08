const path = require('path');

/**
 * Import specs
 */

const dir = '../tests/specs/';
[
  'utils',
  'main',
  'collection',
  'finder',
].forEach((script) => {
  require(path.join(dir, script));
});
