const mongoose = require('mongoose');

const EtsyUserSchema = new mongoose.Schema({
  login_name: {
    type: String,
    required: true,
    unique: true
  },
  primary_email: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  etsy_user_id: {
    type: Object,
    required: true,
    unique: true
  },
  oauth_token_secret: {
    type: String,
    required: true
  },
  oauth_token: {
    type: String,
    required: true
  },
  oauth_verifier: {
    type: String,
    required: true
  }
});

const EtsyUserShipping = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  etsy_user_id: {
    type: Object,
    required: true
  },
  shipping_template_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});
const EtsyUserListings = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  etsy_user_id: {
    type: Object,
    required: true
  },
  listing_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

const EtsyUserModel = mongoose.model('etsyUser', EtsyUserSchema);
const EtsyUserShippingModel = mongoose.model(
  'etsyUserShipping',
  EtsyUserShipping
);
const EtsyUserListingModel = mongoose.model(
  'etsyUserListing',
  EtsyUserListings
);

module.exports = { EtsyUserModel, EtsyUserShippingModel, EtsyUserListingModel };
