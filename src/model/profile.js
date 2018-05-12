'use strict';

import mongoose from 'mongoose';

const profileSchema = mongoose.Schema({
  firstName: { 
    type: String,
    required: true, 
  },
  lastName: { 
    type: String,
    required: true,
  },
  bio: { type: String },
  avatar: { type: String },
  account: {
    type: mongoose.Schema.ObjectId,
    // do you need an account to have a profile? if yes then true
    required: true,
    unique: true,
    // can accounts have more than one profile? if noo then true
  },
});

export default mongoose.model('profile', profileSchema);
