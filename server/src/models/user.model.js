const ObjectId = require('mongodb').ObjectID,
      environment = require('../environments/environment.js'),
      db = require('../db.js');

exports.incrementViewCounter = (videoId) => {
  return new Promise((resolve, reject) => {
    const videos = db.get().collection('videos');
    // const objId = ObjectId(videoId);
    videos.update(
      { episodes: {$elemMatch: {id: videoId}}},
      { $inc : { "episodes.$.viewCount" : 1 }},
      function (err, result) {
        if (err) reject(err);
        resolve({message: `Video ${videoId} viewCount updated`});
      }
    )
  });
}

exports.getDetails = (videoId) => {
  return new Promise((resolve, reject) => {
    const videos = db.get().collection('videos');
    videos.aggregate([
      {$match: {'episodes.id': videoId}},
      { $unwind : "$episodes" },
      { $match : { "episodes.id": videoId } }
    ]).toArray((err, result) => {
      console.log(err);
      if (err) reject(err);
      resolve(result);
    });
  });
}
