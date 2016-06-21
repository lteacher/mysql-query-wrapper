'use strict'

const test = require('ava');
const db = require('../lib/wrapper')();

// Setup tables / any data etc
test.before(async t => {
  // omg async / await booyakasha!
  await db.query('drop table if exists user;');
  let result = await db.query(
    `create table user(
      id int not null auto_increment,
      firstName varchar(255),
      lastName varchar(255),
      username varchar(40),
      password varchar(40),
      primary key (id)
    );`
  );

  return result;
});

test('Can insert a single entry', async t => {
  let user = {
    firstName: 'Bill',
    lastName: 'Smith'
  };

  let result = await db.insert('user', user);
  t.is(result['affectedRows'], 1);
});

// TODO: This fails and it would be nice if it worked, looks like a change
// is required for this...
test.skip('Can insert multiple entries', async t => {
  let users = [{
    firstName: 'Jack',
    lastName: 'Frank'
  }, {
    firstName: 'Jill',
    lastName: 'Frank'
  }];

  let result = await db.insert('user', users);
  t.is(result['affectedRows'], 2);
});

test('Can update an existing entry', async t => {
  let user = {
    firstName: 'Tobe',
    lastName: 'Updated'
  };

  let result = await db.insert('user', user);
  t.is(result['affectedRows'], 1);

  result = await db.update('user',{firstName: 'Hasbeen'},['firstName','Tobe']);
  t.is(result['affectedRows'], 1);
});
