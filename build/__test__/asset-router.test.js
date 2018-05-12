'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _assetMock = require('./lib/asset-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { mock } from 'sinon';

var apiURL = 'http://localhost:' + process.env.PORT;

describe('TESTING ROUTES AT /assets', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_assetMock.pRemoveAssetMock);

  describe('POST  200 for a succesful post to /assets', function () {
    test('should return a 200', function () {
      var accountMock = null;
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiURL + '/assets').set('Authorization', 'Bearer ' + token).field('title', 'titletestvalue').attach('asset', __dirname + '/assets/asset_test.JPG').then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual('titletestvalue');
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      });
    });
  });
  describe('POST  400 for Bad Request', function () {
    test('should return a 400', function () {
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.post(apiURL + '/assets').set('Authorization', 'Bearer ' + token).field('title', 'titletestvalue').attach('asset', __dirname + '/assets/asset_test.JPG').attach('asset', __dirname + '/assets/asset_test.JPG').then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(400);
        });
      });
    });
  });
  describe('POST  401 for no Token', function () {
    test('should return a 401', function () {
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        return _superagent2.default.post(apiURL + '/assets').set('Authorization', 'Bearer ').field('title', 'titletestvalue').attach('asset', __dirname + '/assets/asset_test.JPG').then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(401);
        });
      });
    });
  });
  describe('GET  200 for a succesful get from /assets', function () {
    test('should return a 200', function () {

      var testMock = null;
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        testMock = mockResponse.asset;
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiURL + '/assets/' + testMock._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(200);
          expect(response.body.title).toEqual(testMock.title);
          expect(response.body._id).toBeTruthy();
          expect(response.body.url).toBeTruthy();
        });
      }).catch(function (err) {
        expect(err.status).toEqual(200);
      });
    });
  });
  describe('GET  404 for Bad ID/ no resource', function () {
    test('should return a 404', function () {
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiURL + '/assets/BAD_ID').set('Authorization', 'Bearer ' + token).then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(404);
        });
      });
    });
  });
  describe('GET  401 for no token', function () {
    test('should return a 401', function () {
      var testMock = null;
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        testMock = mockResponse.asset;
        var token = mockResponse.accountMock.token;

        return _superagent2.default.get(apiURL + '/assets/' + testMock._id).set('Authorization', 'Bearer ').then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(401);
        });
      });
    });
  });
  describe('DELETE 204 for successful delete!', function () {
    test('should return 204', function () {

      var testMock = null;
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        testMock = mockResponse.asset;
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiURL + '/assets/' + testMock._id).set('Authorization', 'Bearer ' + token).then(function (response) {
          expect(response.status).toEqual(204);
        });
      });
    });
  });
  describe('DELETE  404 for Bad ID/ no resource', function () {
    test('should return a 404', function () {
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiURL + '/assets/BAD_ID').set('Authorization', 'Bearer ' + token).then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(404);
        });
      });
    });
  });
  describe('DELETE  401 for no token', function () {
    test('should return a 401', function () {
      var testMock = null;
      return (0, _assetMock.pCreateAssetMock)().then(function (mockResponse) {
        testMock = mockResponse.asset;
        var token = mockResponse.accountMock.token;

        return _superagent2.default.delete(apiURL + '/assets/' + testMock._id).set('Authorization', 'Bearer ').then(Promise.reject).catch(function (err) {
          expect(err.status).toEqual(401);
        });
      });
    });
  });
});