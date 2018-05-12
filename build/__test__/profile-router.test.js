'use strict';

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _server = require('../lib/server');

var _profileMock = require('./lib/profile-mock');

var _accountMock = require('./lib/account-mock');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apiURL = 'http://localhost:' + process.env.PORT;

describe('POST /profiles', function () {
  beforeAll(_server.startServer);
  afterAll(_server.stopServer);
  afterEach(_profileMock.pRemoveProfileMock);

  test('POST /profiles should return a 200 if there are no errors', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({
        bio: 'I so coool',
        firstName: 'testbro',
        lastName: 'lastnamebro'
      });
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body.account).toEqual(accountMock.account._id.toString());
      expect(response.body.lastName).toEqual('lastnamebro');
      expect(response.body.firstName).toEqual('testbro');
    });
  });
  test('POST /profiles should return a 400 - bad request', function () {
    var accountMock = null;
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      accountMock = accountSetMock;
      return _superagent2.default.post(apiURL + '/profiles').set('Authorization', 'Bearer ' + accountSetMock.token).send({});
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });
  test('POST /profiles should return a 400 - no token', function () {
    return (0, _accountMock.pCreateAccountMock)().then(function (accountSetMock) {
      return _superagent2.default.post(apiURL + '/profiles').send({
        bio: 'I so coool',
        firstName: 'testbro',
        lastName: 'lastnamebro'
      });
    }).then(Promise.reject).catch(function (response) {
      expect(response.status).toEqual(400);
    });
  });

  test('GET /profiles should return a 200 if there are no errors', function () {
    var profileMock = null;
    return (0, _profileMock.pCreateProfileMock)().then(function (profileSetMock) {
      profileMock = profileSetMock.profile;
      return _superagent2.default.get(apiURL + '/profiles/' + profileMock._id);
    }).then(function (response) {
      expect(response.status).toEqual(200);
      expect(response.body._id).toEqual(profileMock._id.toString());
      expect(response.body.lastName).toEqual(profileMock.lastName);
      expect(response.body.firstName).toEqual(profileMock.firstName);
    });
  });
  test('GET /profiles should return a 404 - no id', function () {
    var profileMock = null;
    return (0, _profileMock.pCreateProfileMock)().then(function (profileSetMock) {
      profileMock = profileSetMock.profile;
      return _superagent2.default.get(apiURL + '/profiles/NOT_VALID');
    }).then(Promise.reject).catch(function (err) {
      expect(err.status).toEqual(404);
    });
  });
});