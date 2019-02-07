const express = require('express');

const usersRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      users = require('../models/users.model'),
      db = require('.././db.js');

      var common = require('./../common');
      var commonEmitter = common.commonEmitter;


usersRouter.route('/pending/verification')
           .get(
              // middlewareHelper.params('data'),
              getUsersPendingVerification(),
              middlewareHelper.responseHandler
           )

function getUsersPendingVerification () {
  return (req, res, next) => {
    users.getUnverifiedUsers()
         .then(list => {
           console.log('PASS');
          commonEmitter.emit('signedDataEvent');
          res.status(200).send(list);
         })
         .catch(err => next(err));
  }
}

module.exports = usersRouter;
