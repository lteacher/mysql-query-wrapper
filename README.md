# Mysql Query Wrapper

Another `mysql` package query wrapper

[![NPM](https://nodei.co/npm/mysql-query-wrapper.png?downloads=true)](https://nodei.co/npm/mysql-query-wrapper/)

[![Build Status](https://travis-ci.org/lteacher/mysql-query-wrapper.svg?branch=master)](https://travis-ci.org/lteacher/mysql-query-wrapper)
[![Coverage Status](https://coveralls.io/repos/github/lteacher/mysql-query-wrapper/badge.svg?branch=master)](https://coveralls.io/github/lteacher/mysql-query-wrapper?branch=master)

Probably like most of the other examples, in refactoring code to make it nicer to use the `mysql` package these functions emerged so why not randomly publish them. If you want to use then obviously go for it. Any issues or features create them at github.

## Features
Converts the mysql query to one that returns a promise unless a callback is provided.

Also adds the following functions which can take a single column condition:
- `update` - _Performs an SQL update returning a promise_
- `insert` - _Performs an SQL insert returning a promise_
- `modify` - _If the entry exists, updates else inserts returning promise_
- `exists` - _Check the existence of some entry returning a promise_
- `query` - _Mysql all purpose query which uses the default callback if provided else returns a promise_

For usage examples take a look in `test/test.js`.
