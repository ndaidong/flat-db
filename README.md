# flat-db
Flat-file based data storage

[![NPM](https://badge.fury.io/js/flat-db.svg)](https://badge.fury.io/js/flat-db)
![Travis](https://travis-ci.org/ndaidong/flat-db.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/flat-db/badge.svg?branch=master&noop)](https://coveralls.io/github/ndaidong/flat-db?branch=master)
![devDependency Status](https://david-dm.org/ndaidong/flat-db.svg)

# Setup

```
npm install flat-db --save
```

# Usage

```
  var FlatDB = require('flat-db');

  // configure path to storage dir
  FlatDB.configure({
    path: 'storage'
  });

  // add collection
  var Movie = FlatDB.addCollection('movies');

  // add item into "Movie" collection
  let key = Movie.add({
    type: 'movie',
    title: 'The Godfather',
    director: 'Francis Ford Coppola',
    writer: 'Mario Puzo',
    imdb: 9.2
  });

  console.log(key);
  // this key is the unique ID of item
  // you can use it to get item
  // for example

  let mov =  Movie.get(key);
  console.log(mov); // output movie info

  // you can also remove the above movie with key
  Movie.remove(key);
  let mov =  Movie.get(key);
  console.log(mov); // null
```

# APIs

### FlatDB
 - .configure(Object options)
 - .getConfigs()
 - .addCollection(String collectionName, Object schema) // schema will be supported in future
 - .getCollection(String collectionName)
 - .emptyCollection(String collectionName)
 - .removeCollection(String collectionName)
 - .reset() // remove all collections

FlatDB.addCollection() and FlatDB.getCollection() return a Collection instance with the following methods:

#### Collection instance
 - .add(Object item) // return item key
 - .update(String itemKey, Object updates) // return item
 - .get([String itemKey]) // return specified item or the entire collection if no parameter
 - .remove(String itemKey) // return true if removing success
 - .find(Object criteria) // not implemented


# Test

```
git clone https://github.com/ndaidong/flat-db.git
cd flat-db
npm install
npm test
```

# License

The MIT License (MIT)
