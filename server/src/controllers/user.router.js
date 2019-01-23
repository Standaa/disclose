'use strict';

const express = require('express'),
      multer = require('multer');

const upload = multer({ dest: 'uploads/' });

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      user = require('../models/user.model'),
      db = require('.././db.js');

var cpUpload = upload.fields([{ name: 'firstName', maxCount: 1 }, { name: 'publicSignalsStr', maxCount: 1 },{ name: 'proofStr', maxCount: 1 },{ name: 'userUploadedFile', maxCount: 1 }])

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
    console.log('req.body proofStr', req.body.proofStr);
    console.log('req.body publicSignalsStr', req.body.publicSignalsStr);

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
