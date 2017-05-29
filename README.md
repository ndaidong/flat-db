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

# APIs

- FlatDB.configure(Object options)
- FlatDB.Collection(String name[, Object schema]) - return Collection instance
  - .add(Object entry | Array entries)
  - .get(String key)
  - .update(String key, Object updates)
  - .remove(String key)
  - .all()
  - .count()
  - .reset()
  - .find() - return Finder class instance
    - .equals(String property, String | Number value)
    - .notEqual(String property, String | Number value)
    - .gt(String property, Number value)
    - .gte(String property, Number value)
    - .lt(String property, Number value)
    - .lte(String property, Number value)
    - .matches(String property, RegExp value)
    - .skip(Number value)
    - .limit(Number value)
    - .run()


Example:

```

var FlatDB = require('flat-db');

// configure path to storage dir
FlatDB.configure({
  dir: './storage'
});
// since now, everything will be saved under ./storage

// create Movie collection with schema
let Movie = new FlatDB.Collection('movies', {
  title: '',
  year: 0
});

// The schema is optional. Once it was defined, any new item come later would be compared with this schema's structure and data type.

// insert a set of movies into collection
Movie.add([
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
]);

// find items with imdb < 7.1
results = Movie.find().lt('imdb', 7.1).run();
console.log(results);

// find items which have "re" in the title
results = Movie.find().matches('title', /re/i).run();
console.log(results);


// get 2 items since 2nd item, with imdb > 6 and title contains "God",
let results = Movie
            .find()
            .gt('imdb', 6)
            .matches('title', /God/)
            .skip(2)
            .limit(2)
            .run();
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
