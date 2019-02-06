const db = require('../db.js'),
      ObjectId = require('mongodb').ObjectID;

exports.add = (data) => {
  return new Promise((resolve, reject) => {
    const user = db.get().collection('user');
    user.insertOne(data,
      function (err, result) {
        console.log('insert');
        if (err) reject(err);
        resolve(result.insertedId);
      }
    )
  });
}

exports.setUserVerified = (id) => {
  return new Promise((resolve, reject) => {
    const user = db.get().collection('user');
    user.updateOne(
      { _id: ObjectId(id) },
      { $set: { "isVerified": true } },
    function(err, user) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
