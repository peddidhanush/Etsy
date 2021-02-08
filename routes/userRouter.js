const router = require('express').Router();

const auth = require('../middlewares/auth');

/**
 * Get Routes
 */

router.get('/', auth, (req, res) => {
  res.status(200).send({ userDetails: req.userDetails });
});

/**
 * Post Routes
 */

// router.post('/');

module.exports = router;
