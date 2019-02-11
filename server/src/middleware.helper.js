

const self = module.exports = {

  params: (...args) => (req, res, next) => {
    // If the request is a POST, parameters are in the body :
    if (req.method === 'POST') { req.query = req.body; }
    // Check parameters validity
    if (args.map(arg => typeof req.query[arg] !== 'undefined' && req.query[arg] !== '').includes(false)) {
      let err = new Error();
      err.status = 400;
      next(err);
    } else {
      next();
    }
  },

  responseHandler: (req, res, next) => {
    let responseObject = {
       meta: {
               status: req.status || 200,
               endpoint: req.path
             },
       data : req.jsonData
     }
     res.status(200).send(responseObject);
  },

  errorHandler: (err, req, res, next) => {
    if (err) {
      console.log(`error handler ${err}`);
      const errStatusCode = err.status || err.statusCode;
      res.status(errStatusCode).json({
        status: errStatusCode,
        message: self.errorMessage(req, errStatusCode)
      });
    }
  },

  headers: (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  },

  errorMessage: (req, statusCode) => {
    switch (statusCode) {
      case 404:
        return `${(req.path).substring(1)} not found`;
        break;
      case 400:
        return `bad_request - Check request parameters`;
        break;
      case 403:
        return `forbidden - Api limit exceeded or proxy banned`;
        break;
      case 503:
        return `service_not_available - The server refused to respond`;
        break;
      case 500:
        return `internal_server_error - The server ecoutered an error`;
        break;
      default:
        return `unknown_error - Unknown error, check logs`;
        break;
    }
  }

};
