# flat-db
Flat-file based data storage

[![NPM](https://badge.fury.io/js/flat-db.svg)](https://badge.fury.io/js/flat-db)
![CI test](https://github.com/ndaidong/flat-db/workflows/ci-test/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/ndaidong/flat-db/badge.svg)](https://coveralls.io/github/ndaidong/flat-db)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ndaidong_flat-db&metric=alert_status)](https://sonarcloud.io/dashboard?id=ndaidong_flat-db)


# Setup

```
npm install flat-db --save
```

# APIs

- FlatDB.configure(Object options)
- FlatDB.Collection(String name[, Object schema]) - Constructor - return Collection class instance
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

```js

const FlatDB = require('flat-db');

// configure path to storage dir
FlatDB.configure({
  dir: './storage',
});
// since now, everything will be saved under ./storage

// create Movie collection with schema
const Movie = new FlatDB.Collection('movies', {
  title: '',
  imdb: 0,
});

// The schema is optional.
// But once it was defined, any new item come later
// will be compared with this schema's structure and data type

// insert a set of movies into collection
const keys = Movie.add([
  {
    title: 'The Godfather',
    imdb: 9.2,
  },
  {
    title: 'Independence Day: Resurgence',
    imdb: 7.1,
  },
  {
    title: 'Free State of Jones',
    imdb: 6.4,
  },
  {
    title: 'Star Trek Beyond',
    imdb: 5.7,
  },
]);
console.log('\nkeys returned after adding multi items:');
console.log(keys);

// add a single movie
const key = Movie.add({
  title: 'X-Men',
  imdb: 8.3,
  year: 2011,
});
// the property "year" will be ignored
// because it does not match with schema
console.log('\nkey returned after adding single item:');
console.log(key);

// get item with given key
const movie = Movie.get(key);
console.log(`\nget item by key ${key}:`);
console.log(movie);

// update it
const updating = Movie.update(key, {
  title: 123456,
  imdb: 8.2,
});
// the property "title" will be ignored
// because it does not match with expected type
console.log('\nupdating result:');
console.log(updating);

// remove it
const removing = Movie.remove(key);
console.log('\nremoving result:');
console.log(removing);

// count collection size
const count = Movie.count();
console.log('\ncollection size:');
console.log(count);

// get all item
const all = Movie.all();
console.log('\nall items:');
console.log(all);

// find items with imdb < 7.1
const results = Movie.find().lt('imdb', 7.1).run();
console.log('\nitems with imdb < 7.1:');
console.log(results);

// get 2 items since 2nd item (skip first item), which have "re" in the title
const results = Movie.find().matches('title', /re/i).skip(1).limit(2).run();
console.log('\n2 items since 2nd item (skip first one), \n which have "re" in the title:');
console.log(results);


// find items with imdb > 6 and title contains "God"
const results = Movie
            .find()
            .gt('imdb', 6)
            .matches('title', /God/)
            .run();
console.log('\nitems with imdb > 6 and title contains "God":');
console.log(results);

// remove all
Movie.reset();

// count collection size after removing all
const count = Movie.count();
console.log('\ncollection size after removing all:');
console.log(count);
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
