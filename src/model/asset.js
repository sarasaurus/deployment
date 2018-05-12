'use strict';

import mongoose from 'mongoose';

const assetSchema = mongoose.Schema({
  title: { 
    type: String,
    required: true, 
  },
  url: { 
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: () => new Date(), 
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    // schema.types is just more verboase version of provious version so we thinkg
    required: true,
  },
});

export default mongoose.model('asset', assetSchema);
