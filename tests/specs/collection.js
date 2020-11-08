/**
 * Testing
 * @ndaidong
 */

const test = require('tap').test;

const {
  isFunction,
  isString,
} = require('bellajs');

const FlatDB = require('../../src/main');
const Finder = require('../../src/finder');

test('Test FlatDB.Collection class:', (assert) => {
  const userCollection = FlatDB.getCollection('users');

  const methods = [
    'all',
    'add',
    'get',
    'update',
    'remove',
    'find',
    'reset',
  ];

  const sampleData = [
    {
      name: 'Alice',
      age: 16,
    },
    {
      name: 'Bob',
      age: 15,
    },
    {
      name: 'Kelly',
      age: 17,
    },
  ];

  assert.ok(userCollection instanceof FlatDB.Collection, 'userCollection must be instance of FlatDB.Collection');

  methods.forEach((met) => {
    assert.ok(isFunction(userCollection[met]), `userCollection must have the method .${met}()`);
  });

  assert.comment('Add sample data with Collection.add()');
  const keys = userCollection.add(sampleData);
  assert.equals(keys.length, 3, 'userCollection.add(sampleData) must return 3 keys');

  assert.comment('Get all collection entries with Collection.all()');
  const users = userCollection.all();
  assert.equals(users.length, 3, 'userCollection.all() must return 3 entries');

  assert.comment('Get specific entry with Collection.get()');

  let k = 0;
  users.forEach((u) => {
    const user = userCollection.get(u._id_);
    const ref = sampleData[k];
    assert.equals(user.name, ref.name, `user.name must be "${ref.name}"`);
    assert.equals(user.age, ref.age, `user.age must be "${ref.age}"`);
    k++;
  });

  assert.comment('Update specific entry with Collection.update()');
  const alice = users[0];
  const {_id_: id} = alice;
  userCollection.update(id, {name: 'Ecila'});
  const ecila = userCollection.get(id);
  assert.equals(ecila.name, 'Ecila', `ecila.name must be "Ecila"`);
  assert.equals(ecila.age, alice.age, `ecila.age must be "${alice.age}"`);

  assert.comment('Test exceptions with bad input');

  const badGet = userCollection.get('abc');
  assert.equals(badGet, null, `userCollection.get('abc') must return null`);

  const badUpdate = userCollection.update('abc', {name: 'Tom'});
  assert.equals(badUpdate, false, `userCollection.update('unexistKey') must return false`);

  const nochangeUpdate = userCollection.update(id, {name: 'Ecila'});
  assert.equals(nochangeUpdate, false, `userCollection.update(id, {name: 'Ecila'}) must return false`);

  assert.throws(() => {
    return new FlatDB.Collection('&*^*(&^(*()');
  }, true, `new FlatDB.Collection('&*^*(&^(*()') must throw error`);

  assert.throws(() => {
    return userCollection.get(123);
  }, true, `userCollection.get(123) must throw error`);

  assert.throws(() => {
    return userCollection.add(123);
  }, true, `userCollection.add(123) must throw error`);

  assert.throws(() => {
    return userCollection.update(123, {name: 'X'});
  }, true, `userCollection.update(123, {name: 'X'}) must throw error`);

  const badRemove = userCollection.remove('abc');
  assert.equals(badRemove, false, `userCollection.remove('abc') must return false`);

  assert.throws(() => {
    return userCollection.remove();
  }, true, `userCollection.remove() must throw error`);


  assert.comment('Test if collection single item add() return a key');
  const key = userCollection.add({
    name: 'Zic',
    age: 19,
  });
  assert.ok(isString(key), 'userCollection.add(user) must return a key string');
  assert.equals(key.length, 32, 'key.length must be 32');

  assert.comment('Test if collection update() return a mutual item');
  const mutual = userCollection.update(key, {name: 'Lina'});
  assert.equals(mutual.name, 'Lina', 'mutual.name must be "Lina"');

  assert.comment('Test collection find()');
  const finder = userCollection.find();
  assert.ok(finder instanceof Finder, 'userCollection.find() must return an instance of Finder');

  userCollection.reset();

  assert.end();
});

test('Test FlatDB.Collection class with persistent data:', (assert) => {
  FlatDB.configure({
    dir: './/test///db',
  });

  const Movie = new FlatDB.Collection('movies', {
    title: '',
    imdb: 0,
  });

  Movie.add({
    title: 'Independence Day: Resurgence',
    imdb: 7.1,
  });

  const arr = Movie.all();
  assert.equals(arr.length, 2, `Movie must have 2 entries`);

  const {_id_} = arr[1];
  Movie.remove(_id_);

  assert.equals(Movie.count(), 1, `Movie must have 1 entry`);

  assert.end();
});
