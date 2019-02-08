const express = require('express'),
      multer = require('multer'),
      snarkjs = require('snarkjs'),
      fs = require('fs'),
      createBlakeHash = require("blake-hash"),
      bigInt = snarkjs.bigInt,
      babyJub = require("./../crypto/babyjub"),
      pedersenHash = require("./../crypto/pedersenHash").hash;

const { stringifyBigInts, unstringifyBigInts } = require("snarkjs/src/stringifybigint.js");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const userRouter = express.Router(),
      middlewareHelper = require('.././middleware.helper.js'),
      cryptoHelper = require('./../crypto/crypto.helper.js'),
      user = require('../models/user.model'),
      db = require('.././db.js');

var cpUpload = upload.fields([
  { name: 'idProof', maxCount: 1 }
])

const SIGNING_KEY = process.env.SIGNING_KEY;

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

    let data = {
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
        let bigIntFormValueRepresentation = bigInt(intShortHexFormValue);
        inputs.push(bigIntFormValueRepresentation.toString());
      }
    });

    // Remove Merkle root from Merkle tree
    const receivedMerkle = JSON.parse(data.publicSignalsStr).slice(2);

    // Compare the two arrays to see if they match
    if (inputs.length === receivedMerkle.length && inputs.every((value, index) => value === receivedMerkle[index])) {
      const proof = unstringifyBigInts(JSON.parse(data.proofStr));
      const publicSignals = unstringifyBigInts(JSON.parse(data.publicSignalsStr));
      const vk_verifier = unstringifyBigInts(JSON.parse(fs.readFileSync("./src/crypto/verification_key.json", "utf8")));

      // Verify proof
      if (snarkjs.groth.isValid(vk_verifier, proof, publicSignals)) {
        console.log("The proof is valid");

        // Proof is valid, back up user in DB
        user.add(data).then(id => {
          console.log('data from db', data);

          console.log('Raw message', publicSignals[0]);

          let hexMsg = cryptoHelper.decToHex(stringifyBigInts(publicSignals[0]));

          console.log('Raw message hex', hexMsg);

          hexMsg = cryptoHelper.pad(hexMsg, 64);

          const msg = Buffer.from(hexMsg, "hex");

          console.log('Bufferized Message', msg);

          const signedData = sign(SIGNING_KEY, msg);
          console.log('Signed data', signedData);

          const pSignature = packSignature(signedData);
          const uSignature = unpackSignature(pSignature);
          const A = prv2pub(SIGNING_KEY);
          const pPubKey = babyJub.packPoint(A);

          console.log('verify(msg, uSignature, pubKey)', verify(msg, uSignature, A));

          const msgBits = buffer2bits(msg);
          const r8Bits = buffer2bits(pSignature.slice(0, 32));
          const sBits = buffer2bits(pSignature.slice(32, 64));
          const aBits = buffer2bits(pPubKey);

          console.log(`msgBits: ${msgBits} \n r8Bits: ${r8Bits} \n sBits: ${sBits} \n aBits: ${aBits}`);

          let signedDataBits = {};
          signedDataBits.R8 = stringifyBigInts(r8Bits);
          signedDataBits.S = stringifyBigInts(sBits);
          signedDataBits.A = stringifyBigInts(aBits);
          signedDataBits.msg = stringifyBigInts(msgBits);

          console.log('Signed data bits', signedDataBits);

          res.status(200).send(signedDataBits);
        })
        .catch(error => {
          console.log(error);
          // next(error);
          res.status(200).send('Crash');
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
      // Submit signature after verificcation
      res.status(200).send();
    })
    .catch(err => {
        console.log('2', err);
        next(err);
    });
  }
}

function pruneBuffer(_buff) {
    const buff = Buffer.from(_buff);
    buff[0] = buff[0] & 0xF8;
    buff[31] = buff[31] & 0x7F;
    buff[31] = buff[31] | 0x40;
    return buff;
}

function prv2pub(prv) {
    const sBuff = pruneBuffer(createBlakeHash("blake512").update(prv).digest().slice(0,32));
    let s = bigInt.leBuff2int(sBuff);
    const A = babyJub.mulPointEscalar(babyJub.Base8, s.shr(3));
    return A;
}

function buffer2bits(buff) {
    const res = [];
    for (let i=0; i<buff.length; i++) {
        for (let j=0; j<8; j++) {
            if ((buff[i]>>j)&1) {
                res.push(bigInt.one);
            } else {
                res.push(bigInt.zero);
            }
        }
    }
    return res;
}

function packSignature(sig) {
    const R8p = babyJub.packPoint(sig.R8);
    const Sp = bigInt.leInt2Buff(sig.S, 32);
    return Buffer.concat([R8p, Sp]);
}

function unpackSignature(sigBuff) {
    return {
        R8: babyJub.unpackPoint(sigBuff.slice(0,32)),
        S: bigInt.leBuff2int(sigBuff.slice(32,64))
    };
}

function sign(prv, msg) {
    const h1 = createBlakeHash("blake512").update(prv).digest();
    const sBuff = pruneBuffer(h1.slice(0,32));
    const s = bigInt.leBuff2int(sBuff);
    const A = babyJub.mulPointEscalar(babyJub.Base8, s.shr(3));
    const rBuff = createBlakeHash("blake512").update(Buffer.concat([h1.slice(32,64), msg])).digest();
    let r = bigInt.leBuff2int(rBuff);
    r = r.mod(babyJub.subOrder);
    const R8 = babyJub.mulPointEscalar(babyJub.Base8, r);
    const R8p = babyJub.packPoint(R8);
    const Ap = babyJub.packPoint(A);
    const hmBuff = pedersenHash(Buffer.concat([R8p, Ap, msg]));
    const hm = bigInt.leBuff2int(hmBuff);
    const S = r.add(hm.mul(s)).mod(babyJub.subOrder);
    return {
        R8: R8,
        S: S
    };
}

function verify(msg, sig, A) {
    // Check parameters
    if (typeof sig != "object") return false;
    if (!Array.isArray(sig.R8)) return false;
    if (sig.R8.length!= 2) return false;
    if (!babyJub.inCurve(sig.R8)) return false;
    if (!Array.isArray(A)) return false;
    if (A.length!= 2) return false;
    if (!babyJub.inCurve(A)) return false;
    if (sig.S>= babyJub.subOrder) return false;

    const R8p = babyJub.packPoint(sig.R8);
    const Ap = babyJub.packPoint(A);
    const hmBuff = pedersenHash(Buffer.concat([R8p, Ap, msg]));
    const hm = bigInt.leBuff2int(hmBuff);

    const Pleft = babyJub.mulPointEscalar(babyJub.Base8, sig.S);
    let Pright = babyJub.mulPointEscalar(A, hm.mul(bigInt("8")));
    Pright = babyJub.addPoint(sig.R8, Pright);

    if (!Pleft[0].equals(Pright[0])) return false;
    if (!Pleft[1].equals(Pright[1])) return false;
    return true;
}

module.exports = userRouter;
