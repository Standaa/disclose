const express = require('express'),
      multer = require('multer'),
      snarkjs = require('snarkjs'),
      fs = require('fs');

const { stringifyBigInts, unstringifyBigInts } = require("snarkjs/src/stringifybigint.js");

const upload = multer({ dest: 'uploads/' });

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      cryptoHelper = require('./../helpers/crypto.helper.js'),
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

userRouter.route('/informations/:id')
          .get(
            middlewareHelper.params('id'),
            getUserData(),
            middlewareHelper.responseHandler
          )

function uploadUserData() {
  return async (req, res, next) => {

    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      city: req.body.city,
      country: req.body.country,
      age: req.body.age,
      email: req.body.email,
      idProof: req.body.idProof,
      proofStr: req.body.proofStr,
      publicSignalsStr: req.body.publicSignalsStr,
      isVerified: false
    }

    // Reconstitute inputs array from received params and check if merkle tree matches
    let inputs = [];
    Object.keys(data).forEach(function(key, index) {
      if (index < 6) {
        let shortHexFormValue = cryptoHelper.str2Hex(data[key]).slice(-16);
        let intShortHexFormValue = parseInt(shortHexFormValue, 16); //.toString();
        let bigIntFormValueRepresentation = snarkjs.bigInt(intShortHexFormValue);
        inputs.push(bigIntFormValueRepresentation.toString());
      }
    });

    // Remove Merkle root from Merkle tree
    const receivedMerkle = JSON.parse(data.publicSignalsStr).slice(2);

    // Compare the two arrays to see if they match
    if (inputs.length === receivedMerkle.length && inputs.every((value, index) => value === receivedMerkle[index])) {

      console.log('data.proofStr', data.proofStr );
      console.log('data.publicSignalsStr', data.publicSignalsStr);

      let clientSideProof = unstringifyBigInts(JSON.parse(data.proofStr));
      let clientSidePublicSignals = unstringifyBigInts(JSON.parse(data.publicSignalsStr));

      console.log('clientSideProof', clientSideProof);
      console.log('clientSidePublicSignals', clientSidePublicSignals);

      const vk_verifier = unstringifyBigInts(JSON.parse(fs.readFileSync("./src/verification_key.json", "utf8")));

      console.log(vk_verifier);
      if (snarkjs.groth.isValid(vk_verifier, clientSideProof, clientSidePublicSignals)) {
        console.log("The proof is valid");
      } else {
        console.log("The proof is not valid");
      }

    } else {
      throw new Error('Proof could not be verified');
    }

    user.add(data).then(id => {
      console.log("after db", id);
      res.status(200).send(id);
    })
    .catch(error => {
      console.log(error);
      next(error);
    });

  }
}

function getUserData () {
  return (req, res, next) => {
    try {
      const userId = request.params.id;

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
