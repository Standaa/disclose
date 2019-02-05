const db = require('../db.js');

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

exports.getUserInformations = (id) => {
  return new Promise((resolve, reject) => {
    const user = db.get().collection('user');
    user.find(id, function(err, user) {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}
