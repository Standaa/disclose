const db = require('../db.js');

exports.getUnverifiedUsers = () => {
  return new Promise((resolve, reject) => {
    const user = db.get().collection('user');
    user.find({ isVerified: false }).toArray((err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
}
