'use strict'

const test = require('ava');
const db = require('../lib/wrapper')();
const mysql = require('mysql');

// Setup tables / any data etc
test.before(async t => {
  // omg async / await booyakasha!
  await db.query('drop table if exists user;');
  await db.query(
    `create table user(
      id int not null auto_increment,
      firstName varchar(255),
      lastName varchar(255),
      username varchar(40),
      password varchar(40),
      primary key (id)
    );`
  );
  await db.insert('user', {
    firstName: 'Bill',
    lastName: 'singleUpdate'
  });
  await db.insert('user', {
    firstName: 'Jimmy',
    lastName: 'multiUpdate'
  });
  await db.insert('user', {
    firstName: 'Benny',
    lastName: 'multiUpdate'
  });
  await db.insert('user', {
    firstName: 'Jamie',
    lastName: 'singleDeletion'
  });
  await db.insert('user', {
    firstName: 'Johnny',
    lastName: 'multiDeletion'
  });
  await db.insert('user', {
    firstName: 'Sammy',
    lastName: 'multiDeletion'
  });
  await db.insert('user', {
    firstName: 'Modify',
    lastName: 'Me'
  });
  await db.insert('user', {
    firstName: 'Exists',
    lastName: 'Tester'
  });
});

test('Can insert a single entry', async t => {
  let user = {
    firstName: 'Bill',
    lastName: 'Smith'
  };

  let result = await db.insert('user', user);
  t.is(result['affectedRows'], 1);
});

// Insert uses SET but apparently for muti it needs VALUES? which is
// a little bit unfortunate
test.failing('Can insert multiple entries', async t => {
  let users = [{
    firstName: 'Jack',
    lastName: 'Frank'
  }, {
    firstName: 'Jill',
    lastName: 'Frank'
  }];

  let result = await db.insert('user', users);
  t.is(result.affectedRows, 2);
});

test('Can update an existing entry', async t => {
  let result = await db.update('user', {
    lastName: 'Jones'
  }, ['lastName', 'singleUpdate']);
  t.is(result.affectedRows, 1);
});

test('Can update multiple existing entries', async t => {
  let result = await db.update('user', {
    lastName: 'Samson'
  }, ['lastName', 'multiUpdate']);
  t.is(result.affectedRows, 2);
});

test('Can delete an existing entry', async t => {
  let result = await db.delete('user', ['lastName', 'singleDeletion']);
  t.is(result.affectedRows, 1);
});

test('Can delete multiple existing entries', async t => {
  let result = await db.delete('user', ['lastName', 'multiDeletion']);
  t.is(result.affectedRows, 2);
});

test('Can modify an existing entry', async t => {
  let result = await db.modify('user', {
    firstName: 'Dan',
    lastName: 'James'
  }, ['firstName', 'Modify']);
  t.is(result.affectedRows, 1);
});

test('Can modify to insert a new entry', async t => {
  let result = await db.modify('user', {
    firstName: 'Billy',
    lastName: 'Newguy'
  }, ['firstName', 'NoSuchName']);
  t.is(result.affectedRows, 1);
  t.not(result.insertId, 0);
});

test('Can test existence', async t => {
  t.truthy(await db.exists('user', ['firstName','Exists']));
});

test('Can run promisified queries', async t => {
  let result = await db.query(`select * from user where firstName = 'Exists'`);
  t.is(result[0].id,8);
});

test.cb('Can run callback queries', t => {
  db.query(`select * from user where firstName = 'Exists'`,(err,result) => {
    t.is(result[0].id,8);
    t.end();
  });
});

test('Can run query providing a connection',async t => {
  let conn = await db.getConnection();
  let result = await db.query(`select * from user where firstName = 'Exists'`,null,conn);
  t.is(result[0].id,8);
  conn.release();
});
