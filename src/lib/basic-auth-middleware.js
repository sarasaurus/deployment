'use strict';

import HttpError from 'http-errors';
import Account from '../model/account';

export default (request, response, next) => {

  if (!request.headers.authorization) {
    return next(new HttpError(400, 'AUTH BASIC - no header invalid request!'));
  }
  // if here  we know have the authorization header

  const base64AuthHeader = request.headers.authorization.split('Basic ')[1];
  if (!base64AuthHeader) {
    return next(new HttpError(400, 'AUTH BASIC - header no slplit invalid request'));
  }
  const stringAuthHeader = Buffer.from(base64AuthHeader, 'base64').toString();
  // stringAuthHeader should now look like username:password
  const [username, password] = stringAuthHeader.split(':'); // this is ES6 syntax saying assign 0 and 1 index of array to 0,1 index of const []... this is array destructuring!
  if (!username || !password) {
    return next(new Error(400, 'AUTH BASIC - no user or password invalid request'));
  }
  // now have username and password, so now need to find account and login
  return Account.findOne({ username })
    .then((account) => {
      if (!account) {
        return next(new HttpError(404, 'no such account'))// if want to be vague tho can send 400, cause we sneaky in passwords)
      }
      return account.pVerifyPassword(password);
    })
    .then((account) => {
      request.account = account; // <-- mutating the request object and adding an account property to it, so now can acess
      return next(); // moving down the middle ware chain
    })
    .catch(next);
// so now have just the base64 info with username:password
};

