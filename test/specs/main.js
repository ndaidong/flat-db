/**
 * Testing
 * @ndaidong
 */

/* eslint no-undefined: 0*/
/* eslint no-array-constructor: 0*/
/* eslint no-new-func: 0*/
/* eslint no-console: 0*/

var path = require('path');
var test = require('tape');
var bella = require('bellajs');
var async = require('async');
var exec = require('child_process').execSync;

var rootDir = '../../src/';
var FlatDB = require(path.join(rootDir, 'main'));
var Collection = require(path.join(rootDir, 'collection'));

var hasRequiredKeys = (o) => {
  var structure = [
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

  let exp = 'storage/';

  assert.comment('(Call "config" is C, so:)');
  assert.ok(bella.isObject(config), 'C must be an object.');
  assert.ok(hasRequiredKeys(config), 'C must have all required keys.');
  assert.equals(config.storeDir, exp, `C.storeDir must be "${exp}"`);
  assert.equals(FlatDB.getConfigs().storeDir, exp, `FlatDB.getConfigs().storeDir must return "${exp}"`);

  assert.comment('Configure with default options');
  let cnf = FlatDB.configure();
  assert.ok(bella.isObject(cnf), 'cnf must be an object.');
  assert.ok(hasRequiredKeys(cnf), 'cnf must have all required keys.');
  exec('rm -rf ' + cnf.storeDir);

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

  let dir = `storage/${exp}/`;
  assert.equals(userCol.dir, dir, `userCol.dir must be "${dir}"`);

  let dupCollection = () => {
    FlatDB.addCollection(exp);
  };
  assert.throws(dupCollection.bind(null, {}), 'Adding duplicate name should throw an exception');

  assert.comment('Remove collection');
  FlatDB.removeCollection(exp);
  let check = FlatDB.getCollection(exp);
  assert.ok(!check, 'Collection must be removed');

  assert.comment('Reset database');

  let arr = [
    'animals', 'cars', 'people'
  ];

  arr.forEach((col) => {
    FlatDB.addCollection(col);
    var x = FlatDB.getCollection(col);
    assert.ok(x, bella.ucfirst(col) + ' collection must be created.');
  });

  FlatDB.reset();
  arr.forEach((col) => {
    let x = FlatDB.getCollection(col);
    console.log(x);
    assert.ok(!x, bella.ucfirst(col) + ' collection must be removed.');
  });

  assert.end();
});

test('Testing Collection data manapulation:', (assert) => {

  FlatDB.configure({
    path: 'storage/',
    maxTextLength: 500
  });

  let col = 'articles';
  let title = 'Hello world';
  let id = bella.createId(16);
  let _id;

  let movie = {
    type: 'movie',
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    writer: 'Mario Puzo',
    imdb: 9.2
  };
  let _movieId;

  var C = FlatDB.addCollection(col);

  async.series([
    (next) => {
      assert.comment('Add article item');
      C.add({
        id: id,
        title: title
      }).then((key) => {
        assert.ok(key, `Must return an article key: "${key}"`);
        _id = key;
      }).finally(next);
    },
    (next) => {
      assert.comment('Get article item');
      C.get(_id).then((item) => {
        assert.comment('Check article item');
        assert.equals(item.id, id, `item.id must be "${id}"`);
        assert.equals(item.title, title, `item.title must be "${title}"`);
      }).finally(next);
    },
    (next) => {
      assert.comment('Add movie item');
      C.add(movie).then((key) => {
        assert.ok(key, `Must return a movie key: "${key}"`);
        _movieId = key;
      }).finally(next);
    },
    (next) => {
      assert.comment('Get movie item');
      C.get(_movieId, 'title director writer imdb').then((item) => {
        assert.comment('Check movie item');
        assert.equals(item.title, movie.title, `item.title must be "${movie.title}"`);
        assert.equals(item.director, movie.director, `item.director must be "${movie.director}"`);
        assert.equals(item.writer, movie.writer, `item.writer must be "${movie.writer}"`);
        assert.equals(item.imdb, movie.imdb, `item.imdb must be "${movie.imdb}"`);
        assert.ok(!item.type, 'It should not contain "type"');
        assert.ok(!item._id_, 'It should not contain "_id_"');
        assert.ok(!item._ts_, 'It should not contain "_ts_"');
      }).finally(next);
    },
    (next) => {
      assert.comment('Remove movie item');
      C.remove(_movieId).then((item) => {
        assert.comment('Check movie item');
        assert.ok(bella.isObject(item), 'Item has been removed');
      }).finally(next);
    },
    (next) => {
      assert.comment('Empty collection');
      FlatDB.emptyCollection(col);
      C.get(_id).then((a) => {
        assert.equals(a, null, 'Item must be not exist');
      }).finally(next);
    },
    (next) => {
      assert.comment('Remove collection');
      FlatDB.removeCollection(col);
      C.get(_id).then((a) => {
        assert.equals(a, null, 'Item must be gone with removed collection');
      }).finally(next);
    },
    (next) => {
      assert.comment('Empty unexisting collection');
      let re = FlatDB.emptyCollection(col);
      assert.equals(re, false, 'Result should be falsy');
      next();
    },
    (next) => {
      assert.comment('Remove unexisting collection');
      let re = FlatDB.removeCollection(col);
      assert.equals(re, false, 'Result should be falsy');
      next();
    }
  ], (err) => {
    if (err) {
      console.trace(err);
    }
    assert.end();
  });
});
