const key = process.env.ETSY_API_KEY;
const baseURL = 'https://openapi.etsy.com/v2/';
const apiParam = `api_key=${key}`;

const oAuthBase = `${baseURL}oauth/`;
const listingsBase = `${baseURL}listings/`;
const userBase = `${baseURL}users/`;
const taxonomyBase = `${baseURL}taxonomy/`;
const shippingTemplateBase = `${baseURL}shipping/templates/`;

const getSelfUser = `${userBase}__SELF__`;

const getListings = (limit = 50, offset = 0) => {
  return `${listingsBase}active?limit=${limit}&offset=${offset}&${apiParam}`;
};

const callBackURL = () => {
  baseUrl = `http://${process.env.APP_DOMAIN}:${process.env.PORT}/`;
  return `${baseUrl}${process.env.etsycallbackurl}`;
};

const getListingById = (id) => {
  return `${listingsBase}/${id}?${apiParam}`;
};

const getShippingTemplatesByUser = (id) => {
  return `${userBase}${id}/shipping/templates`;
};

const getListingImagesURL = (id) => {
  return `${listingsBase}${id}/images`;
};

const createListingURL = `${listingsBase}`;
const createShippingTempURL = `${shippingTemplateBase}`;
// ?scope=email_r%20listings_r%20listings_w%20listings_d
const getOAuthRequestURL = `${oAuthBase}request_token`;
const getOAuthAccessURL = `${oAuthBase}access_token`;
const getOAuthScopreURL = `${oAuthBase}scopes`;
const getSellerTaxonomyURL = `${taxonomyBase}seller/get?${apiParam}`;
const getCountriesURL = `${baseURL}countries?${apiParam}`;

module.exports = {
  callBackURL,
  getListings,
  getListingById,
  getOAuthAccessURL,
  getOAuthRequestURL,
  getSelfUser,
  getSellerTaxonomyURL,
  createListingURL,
  getOAuthScopreURL,
  getShippingTemplatesByUser,
  getCountriesURL,
  createShippingTempURL,
  getListingImagesURL
};
