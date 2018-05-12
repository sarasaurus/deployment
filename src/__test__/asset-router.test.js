'use strict';

import superagent from 'superagent';
import { startServer, stopServer } from '../lib/server';

import { pRemoveAssetMock, pCreateAssetMock } from './lib/asset-mock';
// import { mock } from 'sinon';

const apiURL = `http://localhost:${process.env.PORT}`;

describe('TESTING ROUTES AT /assets', () => {
  beforeAll(startServer);
  afterAll(stopServer);
  afterEach(pRemoveAssetMock);

  describe('POST  200 for a succesful post to /assets', () => {
    test('should return a 200', () => {
      const accountMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock; 
          return superagent.post(`${apiURL}/assets`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'titletestvalue')
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual('titletestvalue');
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        });
    });
  });
  describe('POST  400 for Bad Request', () => {
    test('should return a 400', () => {
      return pCreateAssetMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock; 
          return superagent.post(`${apiURL}/assets`)
            .set('Authorization', `Bearer ${token}`)
            .field('title', 'titletestvalue')
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(400);
            });
        });
    });
  });
  describe('POST  401 for no Token', () => {
    test('should return a 401', () => {
      return pCreateAssetMock()
        .then((mockResponse) => {
          return superagent.post(`${apiURL}/assets`)
            .set('Authorization', 'Bearer ')
            .field('title', 'titletestvalue')
            .attach('asset', `${__dirname}/assets/asset_test.JPG`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);      
            });
        });
    });
  });
  describe('GET  200 for a succesful get from /assets', () => {
    test('should return a 200', () => {
  
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;
          return superagent.get(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
              expect(response.status).toEqual(200);
              expect(response.body.title).toEqual(testMock.title);
              expect(response.body._id).toBeTruthy();
              expect(response.body.url).toBeTruthy();
            });
        })
        .catch((err) => {
          expect(err.status).toEqual(200);
        });
    });
  });    
  describe('GET  404 for Bad ID/ no resource', () => {
    test('should return a 404', () => {
      return pCreateAssetMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.get(`${apiURL}/assets/BAD_ID`)
            .set('Authorization', `Bearer ${token}`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(404);
            });
        });
    });
  });
  describe('GET  401 for no token', () => {
    test('should return a 401', () => {
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;
          return superagent.get(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', 'Bearer ')
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });
  describe('DELETE 204 for successful delete!', () => {
    test('should return 204', () => {
      
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;
          return superagent.delete(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', `Bearer ${token}`)
            .then((response) => {
              expect(response.status).toEqual(204);  
            });
        });
    });
  });
  describe('DELETE  404 for Bad ID/ no resource', () => {
    test('should return a 404', () => {
      return pCreateAssetMock()
        .then((mockResponse) => {
          const { token } = mockResponse.accountMock;
          return superagent.delete(`${apiURL}/assets/BAD_ID`)
            .set('Authorization', `Bearer ${token}`)
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(404);
            });
        });
    });
  });
  describe('DELETE  401 for no token', () => {
    test('should return a 401', () => {
      let testMock = null;
      return pCreateAssetMock()
        .then((mockResponse) => {
          testMock = mockResponse.asset;
          const { token } = mockResponse.accountMock;
          return superagent.delete(`${apiURL}/assets/${testMock._id}`)
            .set('Authorization', 'Bearer ')
            .then(Promise.reject)
            .catch((err) => {
              expect(err.status).toEqual(401);
            });
        });
    });
  });
});
