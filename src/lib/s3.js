'use strict';

import fs from 'fs-extra';

// path = directory path ptg to asset
// key = aws way to refer to filenames
// these variables inside s3Upload need to be inside a function NB in docs example 1 is not the way, example 2 is the way
// this is weird but needed to get mock environment to work

const s3Upload = (path, key) => {
  const AWS = require('aws-sdk'); // class
  const amazonS3 = new AWS.S3(); // insantiation of the class

  const uploadOptions = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ACL: 'public-read',
    Body: fs.createReadStream(path), // the readable stream is like our bodyparser += taking the chunks of data sent via http and parsing them into a readable stream-- whole
  };
  // .promise() this calls the internal callback of the .upload method -- vanilla aws methods are all node style err first callbacks, being err/data-- this is saying if data-- .then if err .catch, IE when you add .promise() you are basically promisifying their methods, you could make your own function to do this, you could use bluebird whatever.
  return amazonS3.upload(uploadOptions)
    .promise()
    .then((response) => {
      // console.log('S3 RESPONSE: ', response);
      return fs.remove(path)
        .then(() => {
          // this response is from .then on 23, it chains off of 25, but we no want that return so skip the () part
          return response.Location;
        })
        .catch(err => Promise.reject(err));
    })
    .catch((err) => {
      return fs.remove(path)
        .then(() => Promise.reject(err))
        .catch(fserr => Promise.reject(fserr));
    });
};

const s3Remove = (key) => {
  const AWS = require('aws-sdk');
  const amazonS3 = new AWS.S3();
  const removeOptions = {
    Key: key,
    Bucket: process.env.AWS_BUCKET,
  };
  return amazonS3.deleteObject(removeOptions)
    .promise()
    .then((data) => {
      console.log(data, 'AWS SUCCESSFUL DELETION');
    })
    .catch((err) => {
      Promise.reject(err);
    });
};

export { s3Upload, s3Remove };
