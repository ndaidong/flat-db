/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;

const {
  hasProperty,
  isObject,
} = require('bellajs');

const FlatDB = require('../../src/main');

test('Test FlatDB.configure() method:', (assert) => {
  let structure = [
    'ENV',
    'dir',
    'ext',
  ];

  let sampleConf = {
    dir: 'storage',
    ext: '.json',
  };

  let config = FlatDB.configure(sampleConf);

  assert.ok(isObject(config), 'config must be an object');

  structure.forEach((key) => {
    assert.ok(hasProperty(config, key), `config must have the property "${key}"`);
  });

  assert.equals(config.dir, sampleConf.dir, `config.dir must be "${sampleConf.dir}"`);
  assert.equals(config.ext, sampleConf.ext, `config.ext must be "${sampleConf.ext}"`);

  assert.end();
});
