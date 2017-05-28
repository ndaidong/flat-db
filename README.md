# flat-db
Flat-file based data storage

[![NPM](https://badge.fury.io/js/flat-db.svg)](https://badge.fury.io/js/flat-db)
[![Build Status](https://travis-ci.org/ndaidong/flat-db.svg?branch=master)](https://travis-ci.org/ndaidong/flat-db)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/flat-db/badge.svg?branch=master&noop)](https://coveralls.io/github/ndaidong/flat-db?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/ndaidong/flat-db.svg)](https://gemnasium.com/github.com/ndaidong/flat-db)
[![NSP Status](https://nodesecurity.io/orgs/techpush/projects/ba89614a-f3d3-42e3-9aa1-dbdd9096a01c/badge)](https://nodesecurity.io/orgs/techpush/projects/ba89614a-f3d3-42e3-9aa1-dbdd9096a01c)

# Setup

```
npm install flat-db --save
```

# Usage

```
  var FlatDB = require('flat-db');

  // configure path to storage dir
  FlatDB.configure({
    dir: './storage'
  });

  // add collection
  var Movie = new FlatDB.Collection('movies');

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

#### FlatDB.Collection(String name, Object schema) constructor

```
let Movie = new FlatDB.Collection('movies', {
  title: '',
  year: 0
});
```

The schema is optional. If the schema was defined, any new item were added would be founded based this schema's structure and data type.

#### FlatDB.Collection class instance
 - .add(Object item)

```
let key = Movie.add({
// movie data
});
console.log(key);

```

It's possible to add multi items in the same time:

```
let keys = Movie.add([
            {
              // movie data
            },
            {
              // movie data
            }
          ]);
console.log(keys);
 ```

 - .get([String key])

```
let movie = Movie.get(key);
console.log(movie);
 ```

 - .update(String key, Object updates)

```
let movie = Movie.update(key, {
  // mutual data
});
console.log(movie);
 ```

 - .remove(String key)

```
let result = Movie.remove(key);
console.log(result); // true if removed
 ```

 - .find()

Returns the Finder instance

```
let MovieFinder = Movie.find();
console.log(MovieFinder);
 ```


##### Collection Finder instance

  - .equals(String property, String | Number value)
  - .notEqual(String property, String | Number value)
  - .gt(String property, Number value)
  - .gte(String property, Number value)
  - .lt(String property, Number value)
  - .lte(String property, Number value)
  - .matches(String property, RegExp value)
  - .run()


Examples:

```

// configure storage
FlatDB.configure({
  dir: 'storage/'
});

let Movie = new FlatDB.Collection('movies', {

});

// add some movies to collection
let entries = [
  {
    title: 'The Godfather',
    imdb: 9.2
  },
  {
    title: 'Independence Day: Resurgence',
    imdb: 7.1
  },
  {
    title: 'Free State of Jones',
    imdb: 6.4
  },
  {
    title: 'Star Trek Beyond',
    imdb: 5.7
  }
];

Movie.add(entries);

// find items with imdb > 6 and title contains "God"
let results = Movie
            .find()
            .gt('imdb', 6)
            .matches('title', /God/)
            .run();
console.log(results);

// find items which have "re" in the title
results = Movie.find().matches('title', /re/i).run();
console.log(results);

// find items with imdb < 7.1
results = Movie.find().lt('imdb', 7.1).run();
console.log(results);

```

# Test

```
git clone https://github.com/ndaidong/flat-db.git
cd flat-db
npm install
npm test
```

# License

The MIT License (MIT)
