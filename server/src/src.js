if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express'),
      bodyParser = require('body-parser'),
      mongoClient = require('mongodb').MongoClient,
      middlewareHelper = require('./middleware.helper.js'),
      cors = require('cors'),
      app = express(),
      db = require('./db.js'),
      userRouter = require('./controllers/user.router.js'),
      usersRouter = require('./controllers/users.router.js');

const dbUrl = `mongodb://${process.env.MONGO_USR_KEY}:${process.env.MONGO_PWD_KEY}@${process.env.MONGO_HOST_KEY}:${process.env.MONGO_PORT_KEY}/disclose`;

const PORT = process.env.PORT || 3030;

// app.use(bodyParser.json({limit: '50mb'})); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); // to support URL-encoded bodies
app.options('*', cors());
app.use(cors());
app.use('/user', userRouter);
app.use('/users', usersRouter);
app.use(middlewareHelper.errorHandler);

db.connect(dbUrl)
  .then(() => {
    app.listen(PORT, () => console.log(`Started listening on port ${PORT}`));
  })
  .catch(err => {
    console.log('Unable to connect to Mongo', err);
    process.exit(1);
  });



module.exports = app;
