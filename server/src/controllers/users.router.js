const express = require('express');

const usersRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      users = require('../models/users.model'),
      db = require('.././db.js');

usersRouter.route('/pending/verification')
           .get(
              getUsersPendingVerification(),
              middlewareHelper.responseHandler
           )

function getUsersPendingVerification () {
  return (req, res, next) => {
    users.getUnverifiedUsers()
         .then(list => {    
          res.status(200).send(list);
         })
         .catch(err => next(err));
  }
}

module.exports = usersRouter;
