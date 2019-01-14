'use strict';

const express = require('express'),
      multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      user = require('../models/user.model'),
      db = require('.././db.js');

var cpUpload = upload.fields([{ name: 'firstName', maxCount: 1 }, { name: 'userUploadedFile', maxCount: 1 }])

userRouter.route('/upload/informations')
           .post(
              // middlewareHelper.params('data'),
              cpUpload,
              uploadUserData(),
              middlewareHelper.responseHandler
           )

function uploadUserData() {
  return async (req, res, next) => {

    console.log('req.body', req.body.firstName);

    console.log('req.files', req.files['userUploadedFile']);

    // const videoId = req.params.id;

    // console.log("req.body", req.body);

    // let name = req.body.firstName;

    // console.log(body);

    try {
      // res.set('Content-Type', 'text/plain')
      // res.send(`You sent: ${name} to Express`)
      // req.status = 200;      ;
      next();
    } catch (err) {
      console.log(err);
      next(err)
    }
  }
}

module.exports = userRouter;
