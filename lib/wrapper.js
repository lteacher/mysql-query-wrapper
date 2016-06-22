'use strict'

var mysql = require('mysql');

var _pool;

/**
 * The db function is the initialiser for setting a pool if provided on require
 * @param {Pool|Object} [input] - Either a mysql.Pool OR a config options object
 * @return {Function} Returns the db function so we can attach additional exports
 */
var db = function init(input) {
  // Use provided pool
  if(typeof input == 'function') db.pool = input;

  else {
    // Create the pool with any options merged with the below defaults
    db.pool = mysql.createPool(Object.assign({
      user: 'root',
      password: 'root',
      database: 'test'
    },input));
  }

  // Set the local _pool(just for convenience)
  _pool = db.pool;

  return db;
}

/**
 * Exposes pool.getConnection
 * @param {Function} callback - The callback to pass to pool.getConnection()
 */
db.getConnection = function(callback) {
  // No callback?
  if(!callback) {
    // Return promise
    return new Promise((resolve,reject) => {
      _pool.getConnection((err,conn) => {
        if(err) reject(err);
        else resolve(conn);
      });
    })
  }
  else _pool.getConnection(callback);
}

/**
 * Query that has been converted to promise, allows given conn or gets from pool
 * @param {string} sql - An sql query string or options object
 * @param {Array} params - [Name,Value] for conditions
 * @param {Connection} [conn] - Some mysql connection if desired
 * @returns {Promise} Result of the query call
*/
db.query = function(sql, params, conn) {
  // Use the callback method directly if desired
  if (_isCallback(arguments)) return _query.apply(this, arguments);

  if (conn) var connProvided = true;

  let qry = (typeof sql === 'object') ? sql : mysql.format(sql, params);

  // Return Promise for query callback wrapping
  return new Promise((resolve, reject) => {
    _checkConnection(conn).then(conn => {
      conn.query(qry, (err, result) => {
        // Release conn if not provided
        if (!connProvided) conn.release();

        if (err) reject(err);
        else resolve(result);
      });
    }).catch(err => reject(err));
  });
}

/**
 * Check existence of entry in table by single column and value only
 * @param {string} table - A table e.g. transactions
 * @param {Array} [cond] - [Name,Value] for conditions
 * @return {Promise} Result of the exists check
 */
db.exists = function(table, cond) {
  if (cond) return db.query(`select 1 from ?? where ?? = ?`, [].concat(table, cond))
    .then(result => !(result.length === 0));
  else return Promise.resolve(false);
}

/**
 * Performs insert or update for an entry
 * @param {string} table - Name of the table e.g. transactions
 * @param {Object} data - The data that will be used for the modify
 * @param {Array} cond - [Name,Value] for conditions
 * @param {Connection} [conn] - Some mysql connection if desired
 * @returns {Promise} Result of the modify call
 */
db.modify = function(table, data, cond, conn) {
  // If exists update else insert...
  return db.exists(table, cond).then(result => result ?
    db.update(table, data, cond, conn) :
    db.insert(table, data, conn)
  );
}

/**
 * Insert a new entry to table
 * @param {string} table - Name of the table e.g. transactions
 * @param {Object} data - The data that will be used for the modify
 * @param {Connection} [conn] - Some mysql connection if desired
 * @returns {Promise} Result of the insert call
 */
db.insert = function(table, data, conn) {
  return db.query(`insert into ?? set ?`, [].concat(table, data), conn);
}

/**
 * Updated some existing entry in a table
 * @param {string} table - Name of the table e.g. transactions
 * @param {Object} data - The data that will be used for the modify
 * @param {Array} cond - [Name,Value] for conditions
 * @param {Connection} [conn] - Some mysql connection if desired
 * @returns {Promise} Result of the update call
 */
db.update = function(table, data, cond, conn) {
  return db.query(`update ?? set ? where ?? = ?`, [].concat(table, data, cond), conn);
}

/**
 * Delete entr[y|ies] in table
 * @param {string} table - Name of the table e.g. transactions
 * @param {Array} cond - [Name,Value] for conditions
 * @param {Connection} [conn] - Some mysql connection if desired
 * @returns {Promise} Result of the delete call
 */
db.delete = function(table, cond, conn) {
  return db.query(`delete from ?? where ?? = ?`, [].concat(table, cond), conn);
}

// Check and return a connection, or get new connection from the pool
function _checkConnection(conn) {
  // Return Promise for getConnection callback wrapping
  return new Promise((resolve, reject) => {
    if (conn) {
      resolve(conn);
    } else {
      _pool.getConnection((err, conn) => {
        if (err) reject(err); // Reject this error
        else resolve(conn); // Resolve the connection
      })
    }
  });
}

// Exposes the basic query without promise
var _query = function(sql, val, callback) {
  let qry = (typeof sql === 'object') ? sql : mysql.format(sql, val);
  if (!callback && typeof val === 'function') callback = val; // Handle 2 parm scenario

  _pool.getConnection((err, conn) => {
    _pool.query(qry, (err, items, fields) => {
      if (err) return callback(err);

      conn.release();

      callback(err, items);
    });
  });
}

// Test if a callback is provided
var _isCallback = function(args) {
  let a = Array.prototype.slice.call(args);
  return (typeof a.pop() === 'function');
}

/**
 * @module Provides some sort of global DB utility functions
 */
module.exports = db;
