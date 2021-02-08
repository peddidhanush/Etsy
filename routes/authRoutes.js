const router = require('express').Router();

const AuthController = require('../controllers/AuthController');
const {
  signin,
  signup,
  verify,
  forgot,
  forgotVerify
} = require('../middlewares/validation');
/**
 * Signup Route
 */

router.post('/signup', signup, (req, res) => {
  AuthController.signup(req)
    .then((data) => {
      res.status(201).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

/**
 * Verivication Route
 */

router.post('/verify', verify, (req, res) => {
  AuthController.verify(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

/**
 * Signin Route
 */

router.post('/signin', signin, (req, res) => {
  AuthController.signin(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

/**
 * Forgot Password
 */

router.post('/forgot', forgot, (req, res) => {
  AuthController.forgot(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});
router.post('/forgot/verify', forgotVerify, (req, res) => {
  AuthController.fupassword(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

module.exports = router;
