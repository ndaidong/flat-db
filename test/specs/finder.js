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

var rootDir = '../../src/';
var FlatDB = require(path.join(rootDir, 'main'));
var Finder = require(path.join(rootDir, 'finder'));

test('Testing Finder logic:', (assert) => {

  FlatDB.configure({
    path: 'storage/',
    maxTextLength: 500
  });

  let entries = [
    {
      title: 'The Godfather',
      director: 'Francis Ford Coppola',
      writer: 'Mario Puzo',
      imdb: 9.2,
      year: 1974
    },
    {
      title: 'Independence Day: Resurgence',
      director: 'Roland Emmerich',
      writer: 'Nicolas Wright',
      imdb: 7.1,
      year: 1981
    },
    {
      title: 'Free State of Jones',
      director: 'Gary Ross',
      writer: 'Leonard Hartman',
      imdb: 6.4,
      year: 1995
    },
    {
      title: 'Star Trek Beyond',
      director: 'Justin Lin',
      writer: 'Simon Pegg',
      imdb: 5.7,
      year: 2009
    }
  ];

  let Movie = FlatDB.addCollection('movies');
  entries.forEach((item) => {
    Movie.add(item);
  });

  async.series([
    (next) => {
      assert.comment('Check the Finder instance');
      let MovieFinder = Movie.find();
      assert.ok(MovieFinder instanceof Finder, 'MovieFinder must be instance of Finder class.');

      assert.comment('Check the public methods');
      [
        'equals', 'notEqual', 'includes', 'notInclude', 'gt', 'lt', 'matches'
      ].forEach((m) => {
        assert.ok(bella.isFunction(MovieFinder[m]), `MovieFinder must have method .${m}()`);
      });
      next();
    },
    (next) => {
      assert.comment('Check Finder.gt()');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('imdb', 7)
        .execute().then((results) => {
          assert.equals(results.length, 2, 'It must find out 2 items with imdb > 7');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gt() twice');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('imdb', 7)
        .gt('year', 1980)
        .execute().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 item with imdb > 7 and year > 1980');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gt() with unexisting prop');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('something', 1)
        .execute().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt()');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('imdb', 7)
        .execute().then((results) => {
          assert.equals(results.length, 2, 'It must find out 2 items with imdb < 7');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt() twice');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('imdb', 7)
        .lt('year', 2000)
        .execute().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 item with imdb < 7 and year < 2000');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt() with unexisting prop');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('something', 1)
        .execute().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    }
  ], (err) => {
    if (err) {
      console.trace(err);
    }
    assert.end();
  });
});
