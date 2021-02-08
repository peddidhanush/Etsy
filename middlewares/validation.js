const { body, check, validationResult } = require('express-validator');

const validationFunc = (req, res, next) => {
  var errorValidation = validationResult(req);
  if (errorValidation.errors && errorValidation.errors.length != 0) {
    return res.status(400).json({
      error: errorValidation.errors
    });
  }
  next();
};

const signup = [
  body('firstName')
    .not()
    .isEmpty()
    .withMessage('First name must not be empty')
    .isAlpha()
    .withMessage('First name should contain only alphabets')
    .isLength({
      min: 1,
      max: 50
    })
    .withMessage(
      'First name should not be empty, should be more than one and less than 50 character'
    )
    .trim(),
  body('lastName')
    .not()
    .isEmpty()
    .withMessage('Last name must not be empty')
    .isAlpha()
    .withMessage('Last name should contain only alphabets')
    .isLength({
      min: 1,
      max: 50
    })
    .withMessage(
      'Last name should not be empty, should be more than one and less than 50 character'
    )
    .trim(),
  body('zipCode')
    .not()
    .isEmpty()
    .withMessage('Zip Code must not be empty')
    .trim(),
  body('userName')
    .not()
    .isEmpty()
    .withMessage('User Name must not be empty')
    .isEmail()
    .withMessage('User Name must be valid format')
    .trim(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password must not be empty')
    .isLength({
      min: 6,
      max: 20
    })
    .withMessage('password should be more than 6 and less than 20 character')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&\-+#()^{}[\]|\?\/])[A-Za-z\d@$!%*?&\-+#()^{}[\]|\?\/]{8,}$/
    )
    .withMessage(
      'Password must contain at least one uppercase, one lower case, one special character'
    ),
  validationFunc
];

const verify = [
  body('userId')
    .not()
    .isEmpty()
    .withMessage('User id must not be empty')
    .trim(),
  body('verificationCode')
    .not()
    .isEmpty()
    .withMessage('Verification code must not be empty')
    .trim(),
  validationFunc
];

const signin = [
  body('userName')
    .not()
    .isEmpty()
    .withMessage('User Name must not be empty')
    .trim(),
  body('password').not().isEmpty().withMessage('Password must not be empty'),
  validationFunc
];

const forgot = [
  body('userName')
    .not()
    .isEmpty()
    .withMessage('User Name must not be empty')
    .trim(),
  validationFunc
];

const forgotVerify = [
  body('userId')
    .not()
    .isEmpty()
    .withMessage('User id must not be empty')
    .trim(),
  body('verificationCode')
    .not()
    .isEmpty()
    .withMessage('Verification code must not be empty')
    .trim(),
  body('password').not().isEmpty().withMessage('Password must not be empty'),
  validationFunc
];

module.exports = {
  signup,
  signin,
  verify,
  forgot,
  forgotVerify
};
