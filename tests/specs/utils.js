/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;

const {
  isFunction,
  genid,
} = require('bellajs');

const utils = require('../../src/utils');

const {
  fixPath,
  readFile,
  writeFile,
  delFile,
  exists,
  mkdir,
  rmdir,
  normalize,
} = utils;

test('Test utils:', (assert) => {
  const methods = [
    'fixPath',
    'readFile',
    'writeFile',
    'delFile',
    'exists',
    'mkdir',
    'rmdir',
    'normalize',
  ];

  methods.forEach((met) => {
    assert.ok(isFunction(utils[met]), `${met} must be function`);
  });

  const sampleDir = `./sampleDir_${genid()}`;

  mkdir(sampleDir);
  assert.ok(exists(sampleDir), `${sampleDir} must be created`);

  const sampleTextFile = fixPath(`${sampleDir}/tmp.txt`);
  const sampleFileContent = 'Hello world';
  writeFile(sampleTextFile, sampleFileContent);
  assert.ok(exists(sampleTextFile), `${sampleTextFile} must be created`);

  const nonJSON = readFile(sampleTextFile);
  assert.equals(nonJSON, null, `Read data from ${sampleTextFile} must return null`);

  delFile(sampleTextFile);
  assert.equals(exists(sampleTextFile), false, `${sampleTextFile} must be removed`);

  const sampleJSONFile = fixPath(`${sampleDir}/tmp.json`);
  const sampleFileData = {message: 'Hello world'};
  writeFile(sampleJSONFile, sampleFileData);
  assert.ok(exists(sampleJSONFile), `${sampleJSONFile} must be created`);

  const json = readFile(sampleJSONFile);
  const sampleJSON = JSON.stringify(sampleFileData);
  assert.equals(JSON.stringify(json), sampleJSON, `json must be ${sampleJSON}`);

  rmdir(sampleDir);
  assert.ok(!exists(sampleDir), `${sampleDir} must be removed`);

  assert.equals(normalize('abc'), 'abc', `normalize('abc') must be "abc"`);
  assert.equals(normalize('abc&^%'), false, `normalize('abc&^%') must be false`);

  assert.end();
});
