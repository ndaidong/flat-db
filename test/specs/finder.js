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

  Promise.series([
    (next) => {
      assert.comment('Check the Finder instance');
      let MovieFinder = Movie.find();
      assert.ok(MovieFinder instanceof Finder, 'MovieFinder must be instance of Finder class.');

      assert.comment('Check the public methods');
      [
        'matches', 'equals', 'notEqual', 'gt', 'lt', 'run'
      ].forEach((m) => {
        assert.ok(bella.isFunction(MovieFinder[m]), `MovieFinder must have method .${m}()`);
      });
      next();
    },
    (next) => {
      assert.comment('Check Finder.matches() - without "i" flag');
      let MovieFinder = Movie.find();
      MovieFinder
        .matches('title', /re/)
        .run().then((results) => {
          assert.equals(results.length, 2, 'It must find out 2 items with "re" in the title');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.matches() - with "i" flag');
      let MovieFinder = Movie.find();
      MovieFinder
        .matches('title', /re/i)
        .run().then((results) => {
          assert.equals(results.length, 3, 'It must find out 3 items with "re" or "Re" in the title');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.matches() - with no result');
      let MovieFinder = Movie.find();
      MovieFinder
        .matches('title', /something/i)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must find out 0 item with "something" in the title');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.matches() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .matches('star', /something/i)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must find out 0 item with "something" in the "star" field');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.equals()');
      let MovieFinder = Movie.find();
      MovieFinder
        .equals('year', 2009)
        .run().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 movie produced in 2009');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.equals() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .equals('cost', 1000000)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must find out no movie with cost = 1000000');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.notEqual()');
      let MovieFinder = Movie.find();
      MovieFinder
        .notEqual('year', 2009)
        .run().then((results) => {
          assert.equals(results.length, 3, 'It must find out 3 movies that were not produced in 2009');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.notEqual() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .notEqual('cost', 1000000)
        .run().then((results) => {
          assert.equals(results.length, 4, 'It must find out 4 movies with cost != 1000000');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gt()');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('imdb', 7.1)
        .run().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 item with imdb > 7.1');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gt() twice');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('imdb', 7)
        .gt('year', 1980)
        .run().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 item with imdb > 7 and year > 1980');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gt() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .gt('something', 1)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gte()');
      let MovieFinder = Movie.find();
      MovieFinder
        .gte('imdb', 7.1)
        .run().then((results) => {
          assert.equals(results.length, 2, 'It must find out 2 items with imdb >= 7.1');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.gte() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .gte('something', 1)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt()');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('imdb', 7.1)
        .run().then((results) => {
          assert.equals(results.length, 2, 'It must find out 2 items with imdb < 7.1');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt() twice');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('imdb', 7)
        .lt('year', 2000)
        .run().then((results) => {
          assert.equals(results.length, 1, 'It must find out 1 item with imdb < 7 and year < 2000');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lt() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .lt('something', 1)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lte()');
      let MovieFinder = Movie.find();
      MovieFinder
        .lte('imdb', 7.1)
        .run().then((results) => {
          assert.equals(results.length, 3, 'It must find out 3 items with imdb <= 7.1');
        }).finally(next);
    },
    (next) => {
      assert.comment('Check Finder.lte() - with non-exist property');
      let MovieFinder = Movie.find();
      MovieFinder
        .lte('something', 1)
        .run().then((results) => {
          assert.equals(results.length, 0, 'It must return an empty array');
        }).finally(next);
    }
  ]).catch((err) => {
    console.trace(err);
  }).finally(assert.end);
});
