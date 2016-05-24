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

var rootDir = '../../src/';
var FlatDB = require(path.join(rootDir, 'main'));

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
      imdb: 9.2
    },
    {
      title: 'Independence Day: Resurgence',
      director: 'Roland Emmerich',
      writer: 'Nicolas Wright',
      imdb: 7.1
    },
    {
      title: 'Free State of Jones',
      director: 'Gary Ross',
      writer: 'Leonard Hartman',
      imdb: 6.4
    },
    {
      title: 'Star Trek Beyond',
      director: 'Justin Lin',
      writer: 'Simon Pegg',
      imdb: 5.7
    }
  ];

  var Movie = FlatDB.addCollection('movies');
  entries.forEach((item) => {
    Movie.add(item);
  });

  assert.end();
});
