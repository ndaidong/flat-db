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
var Promise = require('promise-wtf');

var rootDir = '../../src/';
var FlatDB = require(path.join(rootDir, 'main'));


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

  let C = FlatDB.addCollection(col);

  Promise.series([
    (next) => {
      assert.comment('Add article item');
      _id = C.add({id, title});
      assert.ok(_id, `Must return an article key: "${_id}"`);
      next();
    },
    (next) => {
      assert.comment('Get article item');
      let item = C.get(_id);
      assert.comment('Check article item');
      assert.equals(item.id, id, `item.id must be "${id}"`);
      assert.equals(item.title, title, `item.title must be "${title}"`);
      next();
    },
    (next) => {
      assert.comment('Add movie item');
      _movieId = C.add(movie);
      assert.ok(_movieId, `Must return a movie key: "${_movieId}"`);

      let addInvalidItem = () => {
        C.add(123);
      };
      assert.throws(addInvalidItem.bind(null, {}), 'Adding invalid item should throw an exception');
      next();
    },
    (next) => {
      assert.comment('Get movie item');
      let item = C.get(_movieId, 'title director writer imdb');
      assert.comment('Check movie item');
      assert.equals(item.title, movie.title, `item.title must be "${movie.title}"`);
      assert.equals(item.director, movie.director, `item.director must be "${movie.director}"`);
      assert.equals(item.writer, movie.writer, `item.writer must be "${movie.writer}"`);
      assert.equals(item.imdb, movie.imdb, `item.imdb must be "${movie.imdb}"`);
      assert.ok(!item.type, 'It should not contain "type"');
      assert.ok(!item._id_, 'It should not contain "_id_"');
      assert.ok(!item._ts_, 'It should not contain "_ts_"');

      let all = C.get();
      assert.ok(bella.isArray(all), 'It should return an array');

      let getInvalidId = () => {
        C.get(1);
      };
      assert.throws(getInvalidId.bind(null, {}), 'Getting with invalid ID should throw an exception');

      next();
    },
    (next) => {
      assert.comment('Update movie item');
      let m = C.update(_movieId, {
        imdb: 9.5,
        actors: ['Denzel Washington', 'Morgan Freeman']
      });
      assert.equals(m.imdb, 9.5, 'item.imdb must be 9.5 instead of 9.2');
      assert.ok(!m.actors, 'It should not contain "actors"');

      let updateNoId = () => {
        C.update();
      };
      assert.throws(updateNoId.bind(null, {}), 'Updating without valid ID should throw an exception');
      next();
    },
    (next) => {
      assert.comment('Remove movie item');
      C.remove(_movieId);
      let item = C.get(_movieId);
      assert.equals(item, null, 'Item must be not exist');

      let removing = C.remove('abc');
      assert.ok(!removing, 'No item found return a unsucess removing');

      let removeNoId = () => {
        C.remove(10);
      };
      assert.throws(removeNoId.bind(null, {}), 'Removing without valid ID should throw an exception');
      next();
    },
    (next) => {
      assert.comment('Empty collection');
      FlatDB.emptyCollection(col);
      let a = C.get(_id);
      assert.equals(a, null, 'Item must be not exist');
      next();
    },
    (next) => {
      assert.comment('Remove collection');
      FlatDB.removeCollection(col);
      let a = C.get(_id);
      assert.equals(a, null, 'Item must be gone with removed collection');
      next();
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
  ]).catch((err) => {
    console.trace(err);
  }).finally(assert.end);
});

test('Testing Collection with schema:', (assert) => {

  FlatDB.configure({
    path: 'storage/',
    maxTextLength: 500
  });

  let User = FlatDB.addCollection('users', {
    username: '',
    email: '',
    age: 0
  });

  assert.comment('New item passed via schema');
  let id = User.add({
    username: 'bob',
    email: 'bob@mail.com',
    location: 'USA'
  });

  let user = User.get(id);
  console.log(user);

  assert.end();
});
