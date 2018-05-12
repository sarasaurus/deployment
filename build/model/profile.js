'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var profileSchema = _mongoose2.default.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  bio: { type: String },
  avatar: { type: String },
  account: {
    type: _mongoose2.default.Schema.ObjectId,
    // do you need an account to have a profile? if yes then true
    required: true,
    unique: true
    // can accounts have more than one profile? if noo then true
  }
});

exports.default = _mongoose2.default.model('profile', profileSchema);