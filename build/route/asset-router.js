'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _express = require('express');

var _httpErrors = require('http-errors');

var _httpErrors2 = _interopRequireDefault(_httpErrors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _asset = require('../model/asset');

var _asset2 = _interopRequireDefault(_asset);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _s2 = require('../lib/s3');

var _bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

var _bearerAuthMiddleware2 = _interopRequireDefault(_bearerAuthMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var multerUpload = (0, _multer2.default)({ dest: __dirname + '/../temp' });
var assetRouter = new _express.Router();

assetRouter.post('/assets', _bearerAuthMiddleware2.default, multerUpload.any(), function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'ASSET ROUTER ERROR: asset not found, no account! '));
  }
  if (!request.body.title || request.files.length > 1 || request.files[0].fieldname !== 'asset') {
    return next(new _httpErrors2.default(400, 'ASSET ROUTER ERROR: invalid request'));
  }

  var _request$files = _slicedToArray(request.files, 1),
      file = _request$files[0];

  var key = file.filename + '.' + file.originalname;

  return (0, _s2.s3Upload)(file.path, key).then(function (url) {
    return new _asset2.default({
      title: request.body.title,
      account: request.account._id,
      url: url
    }).save().then(function (asset) {
      return response.json(asset);
    }).catch(function (err) {
      return next;
    });
  });
});
assetRouter.get('/assets/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  }
  if (!request.params.id) {
    return next(new _httpErrors2.default(404, 'ASSET ROUTER GET ERROR: no params  _id'));
  }
  return _asset2.default.findById(request.params.id).then(function (asset) {
    if (!asset) {
      return next(new _httpErrors2.default(401, 'ASSET in GET- profile route id, but no resource!'));
    }
    _logger2.default.log(_logger2.default.INFO, '200 in profile, GET route!');
    return response.json(asset);
  }).catch(next);
});
assetRouter.delete('/assets/:id', _bearerAuthMiddleware2.default, function (request, response, next) {
  if (!request.account) {
    return next(new _httpErrors2.default(404, 'ASSET ROUTER GET ERROR: asset not found, no account! '));
  }
  if (!request.params.id) {
    return next(new _httpErrors2.default(404, 'ASSET ROUTER DELETE ERROR: no params  _id'));
  }
  return _asset2.default.findByIdAndRemove(request.params.id).then(function (asset) {
    if (!asset) {
      return next(new _httpErrors2.default(401, 'ASSET in DELETE route id, but no resource!'));
    }
    _logger2.default.log(_logger2.default.INFO, '204 in ASSET DELETE route!');
    return (0, _s2.s3Remove)(asset.url);
  }).then(function () {
    return response.sendStatus(204);
  }).catch(next);
});

exports.default = assetRouter;