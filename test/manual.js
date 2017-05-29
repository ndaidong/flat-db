var FlatDB = require('../src/main');

// configure path to storage dir
FlatDB.configure({
  dir: './storage/manual'
});
// since now, everything will be saved under ./storage

// create Movie collection with schema
let Movie = new FlatDB.Collection('movies', {
  title: '',
  imdb: 0
});

// The schema is optional.
// But once it was defined, any new item come later
// will be compared with this schema's structure and data type

// insert a set of movies into collection
let keys = Movie.add([
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
console.log('\nkeys returned after adding multi items:');
console.log(keys);

// add a single movie
let key = Movie.add({
  title: 'X-Men',
  imdb: 8.3,
  year: 2011
});
// the property "year" will be ignored
// because it does not match with schema
console.log('\nkey returned after adding single item:');
console.log(key);

// get item with given key
let movie = Movie.get(key);
console.log(`\nget item by key ${key}:`);
console.log(movie);

// update it
let updating = Movie.update(key, {
  title: 123456,
  imdb: 8.2
});
// the property "title" will be ignored
// because it does not match with expected type
console.log('\nupdating result:');
console.log(updating);

// remove it
let removing = Movie.remove(key);
console.log('\nremoving result:');
console.log(removing);

// count collection size
let count = Movie.count();
console.log('\ncollection size:');
console.log(count);

// get all item
let all = Movie.all();
console.log('\nall items:');
console.log(all);

// find items with imdb < 7.1
let results = Movie.find().lt('imdb', 7.1).run();
console.log('\nitems with imdb < 7.1:');
console.log(results);

// get 2 items since 2nd item (skip first item), which have "re" in the title
results = Movie.find().matches('title', /re/i).skip(1).limit(2).run();
console.log('\n2 items since 2nd item (skip first one), \n which have "re" in the title:');
console.log(results);


// find items with imdb > 6 and title contains "God"
results = Movie
            .find()
            .gt('imdb', 6)
            .matches('title', /God/)
            .run();
console.log('\nitems with imdb > 6 and title contains "God":');
console.log(results);

// remove all
Movie.reset();

// count collection size after removing all
count = Movie.count();
console.log('\ncollection size after removing all:');
console.log(count);
