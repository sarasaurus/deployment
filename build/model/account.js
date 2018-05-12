'use strict';

// account because user is too often a keyword

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this does hahs
var HASH_ROUNDS = 8; // this does big string

var TOKEN_SEED_LENGTH = 128;

// this info will NEVER BE SENT OUTSIDE!!

var accountSchema = _mongoose2.default.Schema({
  passwordHash: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tokenSeed: {
    type: String,
    required: true,
    unique: true

  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  }
});
function pVerifyPassword(password) {
  var _this = this;

  // basically need to run same hash on it
  // bcrypt method to compare two hashes
  // important to note we never compare password to old password-- just to password HASH!
  return _bcrypt2.default.compare(password, this.passwordHash).then(function (result) {
    if (!result) {
      throw new Error('400', 'sneaky sneaky password error AUTH - incorrect data');
      // error should be 401-- but beause this is password, error is sekret coded
    }
    return _this; // means to return the account
  });
}

function pCreateToken() {
  // ES5 funciton so this is scoped to the request object, not the schema object
  this.tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
  return this.save().then(function (account) {
    return _jsonwebtoken2.default.sign({ tokenSeed: account.tokenSeed }, process.env.SOUND_CLOUD_SECRET);
  });
}

accountSchema.methods.pCreateToken = pCreateToken;
accountSchema.methods.pVerifyPassword = pVerifyPassword;

var Account = _mongoose2.default.model('account', accountSchema);

Account.create = function (username, email, password) {
  return _bcrypt2.default.hash(password, HASH_ROUNDS).then(function (passwordHash) {
    password = null;
    var tokenSeed = _crypto2.default.randomBytes(TOKEN_SEED_LENGTH).toString('hex');
    return new Account({
      username: username,
      email: email,
      passwordHash: passwordHash,
      tokenSeed: tokenSeed
    }).save();
  });
};

exports.default = Account;

// we are linking our tokens to the password, but could create separte tokens for diff users then create bearer-user-auth mmiddleware to handle those diff permisionsß