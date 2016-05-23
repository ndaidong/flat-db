# flat-db
Flat-file based data storage

[![NPM](https://badge.fury.io/js/flat-db.svg)](https://badge.fury.io/js/flat-db)
![Travis](https://travis-ci.org/ndaidong/flat-db.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/flat-db/badge.svg?branch=master&noop)](https://coveralls.io/github/ndaidong/flat-db?branch=master)
![devDependency Status](https://david-dm.org/ndaidong/flat-db.svg)

# Setup

```
npm install flat-db
```

And then:

```
  var FlatDB = require('flat-db');

  // configure path to storage dir
  FlatDB.configure({
    path: 'storage'
  });

  // add collection
  var Movie = FlatDB.addCollection('movies');

  // add item into "Movie" collection
  Movie.add({
    type: 'movie',
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    writer: 'Mario Puzo',
    imdb: 9.2
  }).then((key) => {
    console.log(key);
    // this is the unique ID of item
    // you can use it to get item
    // for example

    Movie.get(key).then((mov) => {
      console.log(mov);
    });

    // you can also remove the above movie

    Movie.remove(key).then((mov) => {
      console.log(mov);
      // now is the last time you use this key to refer to the same movie
    });
  }).finally(next);
```

# APIs

### FlatDB
 - .configure(Object options)
 - .getConfigs()
 - .addCollection(String collectionName, Object schema) // schema will be supported in future
 - .getCollection(String collectionName)
 - .emptyCollection(String collectionName)
 - .removeCollection(String collectionName)

FlatDB.addCollection() and FlatDB.getCollection() return a Collection instance with the following methods:

#### Collection instance
 - .add(Object item)
 - .get(String itemKey)
 - .remove(String itemKey)
 - .find(Object condition) // not implemented
 - .clean() // not implemented


# Test

```
git clone https://github.com/ndaidong/flat-db.git
cd flat-db
npm install

// test
npm test
```

# License

The MIT License (MIT)
