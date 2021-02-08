const fs = require('fs');
const path = require('path');
const OAuth = require('oauth').OAuth;
const FormData = require('form-data');
const axios = require('axios');
const multer = require('multer');
const OAuth1 = require('oauth-1.0a');
const request = require('request');
const crypto = require('crypto');
const {
  EtsyUserModel,
  EtsyUserShippingModel,
  EtsyUserListingModel
} = require('../models/EtsyModel');

const {
  getListings: getListingsURL,
  getListingById,
  getOAuthRequestURL,
  getOAuthAccessURL,
  getSelfUser,
  getSellerTaxonomyURL,
  createListingURL,
  getOAuthScopreURL,
  callBackURL,
  getShippingTemplatesByUser,
  getCountriesURL,
  createShippingTempURL,
  getListingImagesURL
} = require('../functions/etsyURLS');
const { get } = require('../functions/http');
const { storage, imageFilter } = require('../functions/upload');
const { generateOAuthSig } = require('../functions/utils');

const oauth = new OAuth(
  getOAuthRequestURL,
  getOAuthAccessURL,
  process.env.ETSY_API_KEY,
  process.env.ETSY_SECRET,
  '1.0A',
  callBackURL(),
  'HMAC-SHA1'
);

const oauth1 = OAuth1({
  consumer: {
    key: process.env.ETSY_API_KEY,
    secret: process.env.ETSY_SECRET
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

const error = {
  status: 500,
  message: 'Technical issue'
};

const userError = {
  status: 404,
  message: 'User Not Found'
};

/**
 * Get Listings
 */

const getListings = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const url = getListingsURL(limit, offset);
      const data = await get(url);
      if (data) {
        return resolve({
          data
        });
      }
      return reject(error);
    } catch (err) {
      return reject(error);
    }
  });
};

/**
 * Etsy Get Listing By Id
 * @param req
 */

const getListing = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { id } = req.params;
      const url = getListingById(id);
      const data = await get(url);
      if (data) {
        return resolve({
          data
        });
      }
      return reject(error);
    } catch (err) {
      return reject(error);
    }
  });
};

/**
 * Get Seller Taxonomy
 * @param req
 */

const getSellerTaxonomy = async (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const data = await get(getSellerTaxonomyURL);
      const { results: taxonomy } = data;
      return resolve({ data: taxonomy });
    } catch (err) {
      return reject(error);
    }
  });

/**
 * Etsy Create Listing By OAuth (Currentr User)
 * @param req
 */

const createListing = async (req, res) =>
  new Promise(async (resolve, reject) => {
    try {
      const upload = multer({
        storage: storage,
        fileFilter: imageFilter
      }).array('images');
      return upload(req, res, async (err) => {
        if (err) {
          console.log(err);
          return reject(error);
        }
        const {
          body: {
            quantity,
            title,
            description,
            price,
            taxonomy_id,
            who_made,
            is_supply,
            when_made,
            shipping_template_id
          },
          userDetails: { _id }
        } = req;
        const etsyUser = await EtsyUserModel.findOne({ user_id: _id });
        if (!etsyUser) {
          return reject({
            status: 500
          });
        }
        const postBody = {
          quantity,
          title,
          description,
          price,
          taxonomy_id,
          who_made,
          is_supply,
          when_made,
          shipping_template_id
        };
        oauth.post(
          createListingURL,
          etsyUser.oauth_token,
          etsyUser.oauth_token_secret,
          postBody,
          async (err, data) => {
            if (err) {
              return reject(error);
            }
            const { results } = JSON.parse(data);
            const { listing_id, title: rTitle } = results[0];
            // imgUrl: `http://localhost:3000/uploads/${file.filename}`,
            // imgPath: path.join(__dirname, `../${file.path}`)
            // console.log(req.files);
            const images = req.files.map((file) => {
              // const imageBody = [];
              const filePath = path.join(__dirname, `../${file.path}`);
              const fileStream = fs.createReadStream(filePath);

              const request_data = {
                url: getListingImagesURL(listing_id),
                method: 'POST',
                data: {
                  image: {
                    value: fileStream,
                    options: {
                      filename: rTitle,
                      contentType: null
                    }
                  }
                }
              };

              const token = {
                key: etsyUser.oauth_token,
                secret: etsyUser.oauth_token_secret
              };

              request(
                {
                  url: request_data.url,
                  method: request_data.method,
                  form: request_data.data,
                  headers: oauth1.toHeader(
                    oauth1.authorize(request_data, token)
                  )
                },
                function (error, response, body) {
                  console.log('Error : ', error);
                  console.log('Response:', response);
                  console.log('Body:', body);
                }
              );

              /*
              imageBody['@image'] = `${fileStream};type=${file.mimetype}`;
              const body = new FormData();
              body.append('image', fileStream);
              // const body = {
              //   image: fileStream
              // };
              const parameters = {
                oauth_consumer_key: process.env.ETSY_API_KEY,
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: Math.floor(Date.now() / 1000),
                oauth_nonce: Math.floor(Date.now() / 1000),
                oauth_version: '1.0'
              };
              const url = getListingImagesURL(listing_id);
              const config = {
                method: 'post',
                url: `${url}?oauth_consumer_key=${
                  parameters.oauth_consumer_key
                }&oauth_token=${etsyUser.oauth_token}&oauth_signature_method=${
                  parameters.oauth_signature_method
                }&oauth_timestamp=${parameters.oauth_timestamp}&oauth_nonce=${
                  parameters.oauth_nonce
                }&oauth_version=1.0&oauth_signature=${generateOAuthSig(
                  'POST',
                  url,
                  parameters,
                  etsyUser.oauth_token_secret
                )}`,
                headers: {
                  ...body.getHeaders()
                },
                data: body
              };
              axios(config)
                .then((res) => {
                  console.log('result: ', res);
                })
                .catch((err) => {
                  console.log('err: ', err);
                });
              oauth.post(
                getListingImagesURL(listing_id),
                etsyUser.oauth_token,
                etsyUser.oauth_token_secret,
                body,
                // 'multipart/form-data',
                async (err, data) => {
                  // fs.unlinkSync(filePath);
                  if (err) {
                    console.log(err);
                    return reject(error);
                  }
                  console.log(data);
                }
              );
              */
            });
            const insertObj = {
              listing_id: listing_id,
              title: rTitle,
              user_id: etsyUser.user_id,
              etsy_user_id: etsyUser.etsy_user_id
            };
            const listingData = await EtsyUserListingModel.findOneAndUpdate(
              {
                user_id: etsyUser.user_id,
                listing_id: results[0].listing_id
              },
              insertObj,
              {
                upsert: true,
                useFindAndModify: false,
                returnOriginal: false
              }
            );
            if (!listingData) {
              return reject(error);
            }
            return resolve({
              data: listingData
            });
          }
        );
      });
    } catch (err) {
      console.log(err, error);
      return reject(error);
    }
  });

/*
const createListing = async (req, res) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        body: {
          quantity,
          title,
          description,
          price,
          taxonomy_id,
          who_made,
          is_supply,
          when_made,
          shipping_template_id
        },
        userDetails: { _id }
      } = req;
      const etsyUser = await EtsyUserModel.findOne({ user_id: _id });
      const postBody = {
        quantity,
        title,
        description,
        price,
        taxonomy_id,
        who_made,
        is_supply,
        when_made,
        shipping_template_id
      };
      oauth.post(
        createListingURL,
        etsyUser.oauth_token,
        etsyUser.oauth_token_secret,
        postBody,
        async (err, data) => {
          if (err) {
            return reject(error);
          }
          const { results } = JSON.parse(data);
          const { listing_id, title: rTitle } = results[0];
          const insertObj = {
            listing_id: listing_id,
            title: rTitle,
            user_id: etsyUser.user_id,
            etsy_user_id: etsyUser.etsy_user_id
          };
          const listingData = await EtsyUserListingModel.findOneAndUpdate(
            {
              user_id: etsyUser.user_id,
              listing_id: results[0].listing_id
            },
            insertObj,
            {
              upsert: true,
              useFindAndModify: false,
              returnOriginal: false
            }
          );
          if (!listingData) {
            return reject(error);
          }
          return resolve({
            data: listingData
          });
        }
      );
    } catch (err) {
      console.log(err, error);
      return reject(error);
    }
  });*/

/**
 * Etsy OAuth
 * @param {*} req
 */

const oAuth = (req) => {
  return new Promise((resolve, reject) => {
    try {
      oauth.getOAuthRequestToken((err, token, token_secret, results) => {
        if (err) {
          return reject(error);
        } else {
          req.oauth = {
            token,
            token_secret
          };
          return resolve({
            data: {
              token,
              token_secret,
              results
            }
          });
        }
      });
    } catch (err) {
      console.log(err);
      return reject(error);
    }
  });
};

/**
 * Etsy OAuth Callback
 * @param req
 */

const oAuthCallback = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        body: { oauth_token, oauth_token_secret, oauth_verifier },
        userDetails: { _id }
      } = req;
      oauth.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        async (err, access_token, access_token_secret, results) => {
          if (!err) {
            const data = await getOAuthUser(access_token, access_token_secret);
            const { user_id, login_name, primary_email } = JSON.parse(
              data
            ).results[0];
            const insertObj = {
              user_id: _id,
              etsy_user_id: user_id,
              login_name,
              primary_email,
              oauth_token: access_token,
              oauth_token_secret: access_token_secret,
              oauth_verifier
            };
            const userData = await EtsyUserModel.findOneAndUpdate(
              {
                user_id: _id
              },
              insertObj,
              {
                upsert: true,
                useFindAndModify: false,
                returnOriginal: false
              }
            );
            if (!userData) {
              return reject(error);
            }
            return resolve({
              data: userData
            });
          }
          if (err) {
            if (err.statusCode == 401) {
              return reject({ status: 401, message: err.data });
            }
          }
          return reject(error);
        }
      );
    } catch (err) {
      return reject(error);
    }
  });
};

/**
 * Etsy Current User By OAuth
 * @param req
 */

const getOAuthUser = (token, token_secret) => {
  return new Promise((resolve, reject) => {
    try {
      oauth.getProtectedResource(
        getSelfUser,
        'GET',
        token,
        token_secret,
        (err, data, response) => {
          if (err) {
            return reject(error);
          } else {
            return resolve(data);
          }
        }
      );
    } catch (err) {
      return reject(error);
    }
  });
};

/**
 * Etsy Current User Scope By OAuth
 */

const getOAuthScope = async (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        userDetails: { _id }
      } = req;
      const etsyUser = await EtsyUserModel.findOne({ user_id: _id });
      oauth.getProtectedResource(
        getOAuthScopreURL,
        'GET',
        etsyUser.oauth_token,
        etsyUser.oauth_token_secret,
        (err, data) => {
          if (!err) {
            return resolve({
              data: JSON.parse(data)
            });
          }
          console.log(err);
          return reject(error);
        }
      );
    } catch (err) {
      console.log(err);
      return reject(error);
    }
  });

/**
 * Etsy Get Countries
 * @param {*} req
 */

const getCountries = async (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const url = getCountriesURL;
      const data = await get(url);
      if (data) {
        return resolve({
          data
        });
      }
      return reject(error);
    } catch (err) {
      return reject(error);
    }
  });

/**
 * Etsy Current User Shippling Profile
 * @param req
 */

const getShippingProfile = async (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        userDetails: { _id }
      } = req;
      const etsyUser = await EtsyUserModel.findOne({ user_id: _id });
      if (!etsyUser) {
        return reject(userError);
      }
      oauth.getProtectedResource(
        getShippingTemplatesByUser(etsyUser.etsy_user_id),
        'GET',
        etsyUser.oauth_token,
        etsyUser.oauth_token_secret,
        (err, data) => {
          if (!err) {
            return resolve({
              data: JSON.parse(data)
            });
          }
          console.log(err);
          return reject(error);
        }
      );
    } catch (err) {
      return reject(error);
    }
  });

/**
 * Create ShippingProfile
 */

const createShipping = async (req) =>
  new Promise(async (resolve, reject) => {
    try {
      const {
        body: { title, origin_country_id, primary_cost, secondary_cost },
        userDetails: { _id }
      } = req;
      const etsyUser = await EtsyUserModel.findOne({ user_id: _id });
      const postBody = {
        title,
        origin_country_id,
        primary_cost,
        secondary_cost
      };
      oauth.post(
        createShippingTempURL,
        etsyUser.oauth_token,
        etsyUser.oauth_token_secret,
        postBody,
        async (err, data) => {
          if (err) {
            return reject(error);
          }
          const { results } = JSON.parse(data);
          const insertObj = {
            shipping_template_id: results[0].shipping_template_id,
            title: results[0].title,
            user_id: etsyUser.user_id,
            etsy_user_id: etsyUser.etsy_user_id
          };
          const shippingData = await EtsyUserShippingModel.findOneAndUpdate(
            {
              user_id: etsyUser.user_id,
              shipping_template_id: results[0].shipping_template_id
            },
            insertObj,
            {
              upsert: true,
              useFindAndModify: false,
              returnOriginal: false
            }
          );
          if (!shippingData) {
            return reject(error);
          }
          return resolve({
            data: shippingData
          });
        }
      );
    } catch (err) {
      console.log(err);
      return reject(error);
    }
  });

module.exports = {
  createListing,
  getListings,
  getListing,
  oAuth,
  oAuthCallback,
  getSellerTaxonomy,
  getOAuthScope,
  getShippingProfile,
  getCountries,
  createShipping
};
