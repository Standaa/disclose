const express = require('express'),
      multer = require('multer'),
      snarkjs = require('snarkjs'),
      fs = require('fs');

const { stringifyBigInts, unstringifyBigInts } = require("snarkjs/src/stringifybigint.js");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      cryptoHelper = require('./../helpers/crypto.helper.js'),
      user = require('../models/user.model'),
      db = require('.././db.js');

var cpUpload = upload.fields([
  { name: 'idProof', maxCount: 1 }
])

userRouter.route('/upload/informations')
           .post(
              cpUpload,
              uploadUserData(),
              middlewareHelper.responseHandler
           )

userRouter.route('/verify/:id')
          .get(
            setUserVerified(),
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
      idProof: req.files.idProof,
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
      const proof = unstringifyBigInts(JSON.parse(data.proofStr));
      const publicSignals = unstringifyBigInts(JSON.parse(data.publicSignalsStr));
      const vk_verifier = unstringifyBigInts(JSON.parse(fs.readFileSync("./src/verification_key.json", "utf8")));

      // Verify proof
      if (snarkjs.groth.isValid(vk_verifier, proof, publicSignals)) {
        console.log("The proof is valid");
        user.add(data).then(id => {
          res.status(200).send();
        })
        .catch(error => {
          console.log(error);
          next(error);
        });
      } else {
        throw new Error('Proof is invalid');
      }
    } else {
      throw new Error('Incorrect informations sent');
    }
  }
}

function setUserVerified () {
  return (req, res, next) => {
    const userId = req.params.id;
    user.setUserVerified(userId)
    .then(data => {
      res.status(200).send();
    })
    .catch(err => {
        console.log('2', err);
        next(err);
    });
  }
}

module.exports = userRouter;
