'use strict';

import faker from 'faker';
import Asset from '../../model/asset';
import { pCreateAccountMock, pRemoveAccountMock } from './account-mock';

const pCreateAssetMock = () => {
  const resultMock = {};

  return pCreateAccountMock()
    .then((mockAcct) => {
      resultMock.accountMock = mockAcct;

      return new Asset({
        title: faker.lorem.words(5),
        url: faker.random.image(),
        account: resultMock.accountMock.account._id, 
      }).save();
    })
    .then((asset) => {
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

const pRemoveAssetMock = () => {
  return Promise.all([
    Asset.remove({}),
    pRemoveAccountMock(),
  ]);
};

export { pCreateAssetMock, pRemoveAssetMock };
