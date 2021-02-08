const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/etsy', require('./etsyRoutes'));
router.use('/user', require('./userRouter'));

module.exports = router;
