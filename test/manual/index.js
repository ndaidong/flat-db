var FlatDB = require('../../index');

FlatDB.configure({
  path: 'storage/'
});

// add a collection names "movies"
let Movie = FlatDB.addCollection('movies');

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

entries.forEach((item) => {
  Movie.add(item);
});

// now we can find the expected movies
Movie
  .find()
  .matches('title', /The/)
  .gt('imdb', 7)
  .run().then((results) => {
    console.log(results);
  });

// or create a CollectionFinder instance to use later
let MovieFinder = Movie.find();

// find items which have "re" in the title
MovieFinder
  .matches('title', /re/i)
  .run().then((results) => {
    console.log(results);
  });

// find items with imdb < 7.1
MovieFinder
  .lt('imdb', 7.1)
  .run().then((results) => {
    console.log(results);
  });

// find items with imdb > 6 and title contains "God"
MovieFinder
  .gt('imdb', 6)
  .matches('title', /God/)
  .run().then((results) => {
    console.log(results);
  });
