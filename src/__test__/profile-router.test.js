'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

import { pRemoveProfileMock, pCreateProfileMock } from './lib/profile-mock';
import { pCreateAccountMock } from './lib/account-mock';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('POST /profiles', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveProfileMock);

  test('POST /profiles should return a 200 if there are no errors', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({
            bio: 'I so coool',
            firstName: 'testbro',
            lastName: 'lastnamebro',
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.account).toEqual(accountMock.account._id.toString());
        expect(response.body.lastName).toEqual('lastnamebro');
        expect(response.body.firstName).toEqual('testbro');
      });
  });
  test('POST /profiles should return a 400 - bad request', () => {
    let accountMock = null;
    return pCreateAccountMock()
      .then((accountSetMock) => {
        accountMock = accountSetMock;
        return superagent.post(`${apiURL}/profiles`)
          .set('Authorization', `Bearer ${accountSetMock.token}`)
          .send({});
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('POST /profiles should return a 400 - no token', () => {
    return pCreateAccountMock()
      .then((accountSetMock) => {
        return superagent.post(`${apiURL}/profiles`)
          .send({
            bio: 'I so coool',
            firstName: 'testbro',
            lastName: 'lastnamebro',
          });
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });

  test('GET /profiles should return a 200 if there are no errors', () => {
    let profileMock = null;
    return pCreateProfileMock()
      .then((profileSetMock) => {
        profileMock = profileSetMock.profile;
        return superagent.get(`${apiURL}/profiles/${profileMock._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body._id).toEqual(profileMock._id.toString());
        expect(response.body.lastName).toEqual(profileMock.lastName);
        expect(response.body.firstName).toEqual(profileMock.firstName);
      });
  });
  test('GET /profiles should return a 404 - no id', () => {
    let profileMock = null;
    return pCreateProfileMock()
      .then((profileSetMock) => {
        profileMock = profileSetMock.profile;
        return superagent.get(`${apiURL}/profiles/NOT_VALID`);
      })
      .then(Promise.reject)
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});
