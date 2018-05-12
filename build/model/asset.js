'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var assetSchema = _mongoose2.default.Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    default: function _default() {
      return new Date();
    }
  },
  account: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    // schema.types is just more verboase version of provious version so we thinkg
    required: true
  }
});

exports.default = _mongoose2.default.model('asset', assetSchema);