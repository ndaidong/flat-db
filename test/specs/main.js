/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/

var path = require('path');
var test = require('tape');
var bella = require('bellajs');
var exec = require('child_process').execSync;

var rootDir = '../../src/';
var FlatDB = require(path.join(rootDir, 'main'));
var Collection = require(path.join(rootDir, 'collection'));

let hasRequiredKeys = (o) => {
  let structure = [
    'storeDir'
  ];

  return structure.every((k) => {
    return bella.hasProperty(o, k);
  });
};

test('Testing "configure" method:', (assert) => {

  let config = FlatDB.configure({
    path: 'storage'
  });

  let exp = 'storage';

  assert.comment('(Call "config" is C, so:)');
  assert.ok(bella.isObject(config), 'C must be an object.');
  assert.ok(hasRequiredKeys(config), 'C must have all required keys.');
  assert.equals(config.storeDir, exp, `C.storeDir must be "${exp}"`);
  assert.equals(FlatDB.getConfigs().storeDir, exp, `FlatDB.getConfigs().storeDir must return "${exp}"`);

  assert.comment('Configure with default options');
  let cnf = FlatDB.configure();
  assert.ok(bella.isObject(cnf), 'cnf must be an object.');
  assert.ok(hasRequiredKeys(cnf), 'cnf must have all required keys.');
  exec(`rm -rf ${cnf.storeDir}`);

  assert.end();
});

test('Testing Collection basic methods:', (assert) => {

  FlatDB.configure({
    path: 'storage'
  });

  assert.comment('Add collection');

  let addCollection = () => {
    FlatDB.addCollection('asdf sadf ');
  };
  assert.throws(addCollection.bind(null, {}), 'Adding invalid name, it should throw an exception');

  let getCollection = () => {
    FlatDB.getCollection('&(lk lsad) ');
  };
  assert.throws(getCollection.bind(null, {}), 'Getting with invalid name, it should throw an exception');

  let exp = 'users';
  FlatDB.addCollection(exp);
  let userCol = FlatDB.getCollection(exp);
  assert.ok(userCol instanceof Collection, 'userCol must be instance of Collection class.');
  assert.equals(userCol.name, exp, `userCol.name must be "${exp}"`);

  let dir = `storage/${exp}`;
  assert.equals(userCol.dir, dir, `userCol.dir must be "${dir}"`);

  assert.comment('Remove collection');
  FlatDB.removeCollection(exp);
  let check = FlatDB.getCollection(exp);
  assert.equals(check, false, 'Collection must be removed');

  assert.comment('Reset database');

  let arr = [
    'animals', 'cars', 'people'
  ];

  arr.forEach((col) => {
    FlatDB.addCollection(col);
    let x = FlatDB.getCollection(col);
    assert.ok(x, bella.ucfirst(col) + ' collection must be created.');
  });

  FlatDB.reset();
  arr.forEach((col) => {
    let x = FlatDB.getCollection(col);
    assert.equals(x, false, bella.ucfirst(col) + ' collection must be removed.');
  });

  assert.end();
});
