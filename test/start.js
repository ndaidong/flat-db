const path = require('path');

/**
 * Import specs
 */

const dir = '../test/specs/';
[
  'utils',
  'main',
  'collection',
  'finder',
].forEach((script) => {
  require(path.join(dir, script));
});
