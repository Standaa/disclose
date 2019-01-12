'use strict';

var mongoClient = require('mongodb').MongoClient;

var state = {
  DB: null
}

exports.get = () => {
  return state.DB;
}

exports.connect = (url) => {
  return new Promise((resolve, reject) => {
    const options = { keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 };
    mongoClient.connect(url, options, (err, database) => {
      if (err) reject(err);
      state.DB = database.db('myhentai');
      resolve();
    });
  });
}

exports.close = () => {
  return new Promise((resolve, reject) => {
    if (state.db) {
      state.db.close((err, result) => {
        if (err) reject(err);
        state.db = null;
        state.mode = null;
        resolve(result);
      });
    }
  });  
}
