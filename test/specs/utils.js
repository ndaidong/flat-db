/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;

const {
  isFunction,
  createId,
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
  let methods = [
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

  let sampleDir = `./sampleDir_${createId()}`;

  mkdir(sampleDir);
  assert.ok(exists(sampleDir), `${sampleDir} must be created`);

  let sampleTextFile = fixPath(`${sampleDir}/tmp.txt`);
  let sampleFileContent = 'Hello world';
  writeFile(sampleTextFile, sampleFileContent);
  assert.ok(exists(sampleTextFile), `${sampleTextFile} must be created`);

  let nonJSON = readFile(sampleTextFile);
  assert.equals(nonJSON, null, `Read data from ${sampleTextFile} must return null`);

  delFile(sampleTextFile);
  assert.equals(exists(sampleTextFile), false, `${sampleTextFile} must be removed`);

  let sampleJSONFile = fixPath(`${sampleDir}/tmp.json`);
  let sampleFileData = {message: 'Hello world'};
  writeFile(sampleJSONFile, sampleFileData);
  assert.ok(exists(sampleJSONFile), `${sampleJSONFile} must be created`);

  let json = readFile(sampleJSONFile);
  let sampleJSON = JSON.stringify(sampleFileData);
  assert.equals(JSON.stringify(json), sampleJSON, `json must be ${sampleJSON}`);

  rmdir(sampleDir);
  assert.ok(!exists(sampleDir), `${sampleDir} must be removed`);

  assert.equals(normalize('abc'), 'abc', `normalize('abc') must be "abc"`);
  assert.equals(normalize('abc&^%'), false, `normalize('abc&^%') must be false`);

  assert.end();
});
