'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pRemoveAssetMock = exports.pCreateAssetMock = undefined;

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _asset = require('../../model/asset');

var _asset2 = _interopRequireDefault(_asset);

var _accountMock = require('./account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pCreateAssetMock = function pCreateAssetMock() {
  var resultMock = {};

  return (0, _accountMock.pCreateAccountMock)().then(function (mockAcct) {
    resultMock.accountMock = mockAcct;

    return new _asset2.default({
      title: _faker2.default.lorem.words(5),
      url: _faker2.default.random.image(),
      account: resultMock.accountMock.account._id
    }).save();
  }).then(function (asset) {
    resultMock.asset = asset;
    return resultMock;
  });
};

/*
pCreateAsset Mock returns:
resultMock = {
  accountMock: with mockAccount,
  asset: with mockAsset
}
*/

var pRemoveAssetMock = function pRemoveAssetMock() {
  return Promise.all([_asset2.default.remove({}), (0, _accountMock.pRemoveAccountMock)()]);
};

exports.pCreateAssetMock = pCreateAssetMock;
exports.pRemoveAssetMock = pRemoveAssetMock;