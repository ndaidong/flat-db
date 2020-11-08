/**
 * Testing
 * @ndaidong
 */

const path = require('path');
const test = require('tap').test;

const {
  isFunction,
} = require('bellajs');

const rootDir = '../../src/';
const FlatDB = require(path.join(rootDir, 'main'));

test('Test Finder class methods:', (assert) => {
  FlatDB.configure({
    dir: './storage/',
  });

  const entries = [
    {
      title: 'The Godfather',
      director: 'Francis Ford Coppola',
      writer: 'Mario Puzo',
      imdb: 9.2,
      year: 1974,
    },
    {
      title: 'Independence Day: Resurgence',
      director: 'Roland Emmerich',
      writer: 'Nicolas Wright',
      imdb: 7.1,
      year: 1981,
    },
    {
      title: 'Free State of Jones',
      director: 'Gary Ross',
      writer: 'Leonard Hartman',
      imdb: 6.4,
      year: 1995,
    },
    {
      title: 'Star Trek Beyond',
      director: 'Justin Lin',
      writer: 'Simon Pegg',
      imdb: 5.7,
      year: 2009,
    },
  ];

  const Movie = new FlatDB.Collection('topmovies');
  Movie.add(entries);

  const MovieFinder = Movie.find();

  assert.comment('Check the public methods');
  [
    'matches', 'equals', 'notEqual', 'gt', 'lt', 'skip', 'limit', 'run',
  ].forEach((m) => {
    assert.ok(isFunction(MovieFinder[m]), `MovieFinder must have method .${m}()`);
  });

  assert.comment('Check Finder.skip()');
  const skips = Movie.find().skip(2).run();
  assert.equals(skips.length, 2, 'It must find out 2 items with skip(2)');

  assert.comment('Check Finder.limit()');
  const limits = Movie.find().limit(1).run();
  assert.equals(limits.length, 1, 'It must find out 1 item with limit(1)');

  assert.comment('Check Finder.matches() - without "i" flag');

  let matches = Movie.find().matches('title', /re/).run();
  assert.equals(matches.length, 2, 'It must find out 2 items with "re" in the title');
  matches = Movie.find().matches('phone', /75687/).run();
  assert.equals(matches.length, 0, 'It must find out 0 items with "75687" in the phone');

  assert.comment('Check Finder.equals()');
  let equals = Movie.find().equals('year', 2009).run();
  assert.equals(equals.length, 1, 'It must find out 1 movie produced in 2009');
  equals = Movie.find().equals('cost', 1000000).run();
  assert.equals(equals.length, 0, 'It must find out no movie with cost = 1000000');

  assert.comment('Check Finder.notEqual()');
  let notEquals = Movie.find().notEqual('year', 2009).run();
  assert.equals(notEquals.length, 3, 'It must find out 3 movies that were not produced in 2009');
  notEquals = Movie.find().notEqual('cost', 1000000).run();
  assert.equals(notEquals.length, 4, 'It must find out 4 movies with cost != 1000000');


  assert.comment('Check Finder.gt()');
  let gts = Movie.find().gt('imdb', 7.1).run();
  assert.equals(gts.length, 1, 'It must find out 1 item with imdb > 7.1');
  gts = Movie.find().gt('cost', 1000000).run();
  assert.equals(gts.length, 0, 'It must find out no movie with non-exist property');

  assert.comment('Check Finder.gte()');
  let gtes = Movie.find().gte('imdb', 7.1).run();
  assert.equals(gtes.length, 2, 'It must find out 2 items with imdb >= 7.1');
  gtes = Movie.find().gte('cost', 1000000).run();
  assert.equals(gtes.length, 0, 'It must find out no movie with non-exist property');

  assert.comment('Check Finder.lt()');
  let lts = Movie.find().lt('imdb', 7.1).run();
  assert.equals(lts.length, 2, 'It must find out 2 items with imdb < 7.1');
  lts = Movie.find().lt('cost', 1000000).run();
  assert.equals(lts.length, 0, 'It must find out no movie with non-exist property');

  assert.comment('Check Finder.lte()');
  let ltes = Movie.find().lte('imdb', 7.1).run();
  assert.equals(ltes.length, 3, 'It must find out 3 items with imdb <= 7.1');
  ltes = Movie.find().lte('cost', 1000000).run();
  assert.equals(ltes.length, 0, 'It must find out no movie with non-exist property');

  Movie.reset();
  assert.end();
});
