const UserModel = require('../models/UserModel');
const {
  generatePassword,
  generateToken,
  comparePassword
} = require('../functions/utils');

/**
 * Signup Function
 */

const signup = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userName, firstName, lastName, password, zipCode } = req.body;
      const insertObj = {
        userName,
        firstName,
        lastName,
        password: generatePassword(password),
        zipCode,
        isVerified: true
      };
      const userData = await UserModel.findOneAndUpdate(
        {
          userName: userName
        },
        insertObj,
        {
          upsert: true,
          useFindAndModify: false,
          returnOriginal: false
        }
      );
      if (userData) {
        const data = {
          message: 'Successfully Signup',
          data: userData
        };
        return resolve({
          data
        });
      }
      reject({ status: 507, message: 'Unable to create account' });
    } catch (err) {
      const error = {
        status: 500,
        message: 'Technical Issue'
      };
      reject(error);
    }
  });
};

/**
 * Signin Function
 */

const signin = async (req) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { userName: uName, password } = req.body;
      const data = await UserModel.findOne({
        userName: uName
      });
      if (!data) {
        return reject({
          status: 404,
          message: 'User Name Does Not Exist'
        });
      }
      const { _id, userName, password: hash, isVerified } = data;
      const pwdVerify = comparePassword(password, hash);
      if (!pwdVerify) {
        return reject({
          status: 404,
          message: 'User Name And Password Does Not Match'
        });
      }
      return resolve({
        data,
        token: generateToken({ _id, userName })
      });
    } catch (err) {
      return reject({
        message: 'Technical Issue',
        status: 500
      });
    }
  });
};

module.exports = {
  signup,
  signin
};
