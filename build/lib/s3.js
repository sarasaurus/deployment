'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s3Remove = exports.s3Upload = undefined;

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// path = directory path ptg to asset
// key = aws way to refer to filenames
// these variables inside s3Upload need to be inside a function NB in docs example 1 is not the way, example 2 is the way
// this is weird but needed to get mock environment to work

var s3Upload = function s3Upload(path, key) {
  var AWS = require('aws-sdk'); // class
  var amazonS3 = new AWS.S3(); // insantiation of the class

  var uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: _fsExtra2.default.createReadStream(path) // the readable stream is like our bodyparser += taking the chunks of data sent via http and parsing them into a readable stream-- whole
  };
  // .promise() this calls the internal callback of the .upload method -- vanilla aws methods are all node style err first callbacks, being err/data-- this is saying if data-- .then if err .catch, IE when you add .promise() you are basically promisifying their methods, you could make your own function to do this, you could use bluebird whatever.
  return amazonS3.upload(uploadOptions).promise().then(function (response) {
    // console.log('S3 RESPONSE: ', response);
    return _fsExtra2.default.remove(path).then(function () {
      // this response is from .then on 23, it chains off of 25, but we no want that return so skip the () part
      return response.Location;
    }).catch(function (err) {
      return Promise.reject(err);
    });
  }).catch(function (err) {
    return _fsExtra2.default.remove(path).then(function () {
      return Promise.reject(err);
    }).catch(function (fserr) {
      return Promise.reject(fserr);
    });
  });
};

var s3Remove = function s3Remove(key) {
  var AWS = require('aws-sdk');
  var amazonS3 = new AWS.S3();
  var removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET
  };
  return amazonS3.deleteObject(removeOptions).promise().then(function (data) {
    console.log(data, 'AWS SUCCESSFUL DELETION');
  }).catch(function (err) {
    Promise.reject(err);
  });
};

exports.s3Upload = s3Upload;
exports.s3Remove = s3Remove;