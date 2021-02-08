const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generatePassword = (password) => {
  const saltRounds = 12;
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (obj) => {
  return jwt.sign(obj, process.env.JWT_AUTH_KEY);
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_AUTH_KEY);
};

const generateOAuthSig = (method, url, parameters, signing_key) => {
  let ordered = {};
  Object.keys(parameters)
    .sort()
    .forEach(function (key) {
      ordered[key] = parameters[key];
    });
  let encodedParameters = '';
  for (k in ordered) {
    const encodedValue = escape(ordered[k]);
    const encodedKey = encodeURIComponent(k);
    if (encodedParameters === '') {
      encodedParameters += encodeURIComponent(`${encodedKey}=${encodedValue}`);
    } else {
      encodedParameters += encodeURIComponent(`&${encodedKey}=${encodedValue}`);
    }
  }

  const encodedUrl = encodeURIComponent(url);
  encodedParameters = encodeURIComponent(encodedParameters);
  const signature_base_string = `${method}&${encodedUrl}&${encodedParameters}`;
  // const signing_key = `${process.env.ETSY_SECRET}&`;
  console.log('KEY:', signing_key);
  const oauth_signature = crypto
    .createHmac('sha1', signing_key)
    .update(signature_base_string)
    .digest()
    .toString('base64');
  // return oauth_signature;
  return encodeURIComponent(oauth_signature);
};

module.exports = {
  generatePassword,
  comparePassword,
  generateToken,
  verifyToken,
  generateOAuthSig
};
