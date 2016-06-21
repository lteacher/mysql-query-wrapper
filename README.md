# Mysql Query Wrapper
[![Build Status](https://travis-ci.org/lteacher/mysql-query-wrapper.svg?branch=master)](https://travis-ci.org/lteacher/mysql-query-wrapper)

Another query wrapper for mysql... Probably like most of the other examples, in refactoring code to make it nicer to use the `mysql` package these functions emerged so why not randomly publish them. If you want to use then obviously go for it. Any issues or features create them at github.

## Features
Converts the mysql query to one that returns a promise unless a callback is provided

Also adds the functions:
- `update` - _Performs an SQL update returning a promise_
- `insert` - _Performs an SQL insert returning a promise_
- `modify` - _If the entry exists, updates else inserts returning promise_
- `exists` - _Check the existence of some entry returning a promise_
- `query` - _Mysql all purpose query which uses the default callback if provided else returns a promise_
