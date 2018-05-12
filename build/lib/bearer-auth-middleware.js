'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _account = require('../model/account');

var _account2 = _interopRequireDefault(_account);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var promisify = function promisify(callbackStyleFunction) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // ...args is a spread operator-- it can take a variable number of arguments, and returns an array-like object of them-- but no can use array methods
    // so if in function signature -- it takes many args, if you CALLING function, you then destrcuting whatever is passed in...?
    // Here have two sets of arguments
    // fn -> the function we want to promisify
    // ..args being whatever arguments the fn we passing in takes as arguments/parameters
    return new Promise(function (resolve, reject) {
      callbackStyleFunction.apply(undefined, args.concat([function (error, data) {
        if (error) {
          return reject(error); // going to the next .catch
        }
        return resolve(data);
        // going to next .then
      }]));
      // ...args.. err, data signature of the oldschool error first callbacks of node.js
    });
  };
};

exports.default = function (request, response, next) {
  if (!request.headers.authorization) {
    return next(new _httpErrors2.default(400, 'AUTH BEARER - no headers invalid Response'));
  }
  var token = request.headers.authorization.split('Bearer ')[1];
  // JWT does not support promises yet!! so must use oldschool function--- 
  if (!token) {
    return next(new _httpErrors2.default(401, 'AUTH BEARER - no token invalid Response'));
  }
  // here jsonWebToken is being based as arg to the callbackSTyleFunction parameter, and then token and process.env are being passed in the the ...args parameter-- these functions are curried, one function rreturns a function, so to call, pass arg to first function, then artgs to second, thus invoking the function it returns(args)(args to  second)
  return promisify(_jsonwebtoken2.default.verify)(token, process.env.SOUND_CLOUD_SECRET).catch(function (error) {
    Promise.reject(new _httpErrors2.default(400, 'AUTH BEARER - Json webtoken Error ' + error));
    // if theres an error in the promisify function it would go here first
    // this is a common tech if you want specfic catches-- order matters here!!!
    // TODO: instead of this .catch you could add this to error-middleware
    // try to avoid thens inside thens-- goal make straight
  }).then(function (decryptedToken) {
    return _account2.default.findOne({ tokenSeed: decryptedToken.tokenSeed });
  }).then(function (account) {
    if (!account) {
      return next(new _httpErrors2.default(400, 'AUTH BEARER - invalid Response'));
    }
    request.account = account;
    return next();
  }).catch(next);
};