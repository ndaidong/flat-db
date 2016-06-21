var FlatDB = require('../../index');

FlatDB.configure({
  path: 'storage'
});

// add collection
let Movie = FlatDB.getCollection('movies');

Movie
  .find()
  .matches('title', /the/i)
  .run().then((docs) => {
    console.log('Result found: %s', docs.length);
    console.log(docs);
  });
