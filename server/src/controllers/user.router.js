'use strict';

const express = require('express'),
      bodyParser = require('body-parser');

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      user = require('../models/user.model'),
      db = require('.././db.js');

userRouter.route('/upload/informations')
           .post(
              // middlewareHelper.params('data'),
              uploadUserData(),
              middlewareHelper.responseHandler
           )

function uploadUserData() {
  return async (req, res, next) => {
    // const videoId = req.params.id;

    const body = req.body.Body

    console.log(body);

    try {
      res.set('Content-Type', 'text/plain')
      res.send(`You sent: ${body} to Express`)
      req.status = 200;      ;
      next();
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userRouter;
