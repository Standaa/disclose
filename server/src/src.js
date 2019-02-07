require('dotenv').config();

const express = require('express'),
      bodyParser = require('body-parser'),
      mongoClient = require('mongodb').MongoClient,
      middlewareHelper = require('./middleware.helper.js'),
      appRoot = require('app-root-path');
      app = express(),
      http = require('http').Server(app),
      io = require('socket.io')(http),
      db = require('./db.js'),
      userRouter = require('./controllers/user.router.js'),
      usersRouter = require('./controllers/users.router.js'),
      common = require('./common'),
      commonEmitter = common.commonEmitter;


const dbUrl = `mongodb://${process.env.MONGO_USR_KEY}:${process.env.MONGO_PWD_KEY}@${process.env.MONGO_HOST_KEY}:${process.env.MONGO_PORT_KEY}/disclose`;

const PORT = 3030;

// app.use(bodyParser.json({limit: '50mb'})); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // to support URL-encoded bodies

app.use(middlewareHelper.headers);
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use(middlewareHelper.errorHandler);



db.connect(dbUrl)
  .then(() => {

    http.listen(PORT, () => console.log(`Started listening on port ${PORT}`));

    io.on('connection', (socket) => {
      console.log('User connected');

      commonEmitter.on('signedDataEvent', () => {
        console.log('EVENT');
        socket.send('EVENT');
      });

      socket.on('disconnect', function() {
        console.log('user disconnected');
      });

    });

  })
  .catch(err => {
    console.log('Unable to connect to Mongo', err);
    process.exit(1);
  });



module.exports = app;
