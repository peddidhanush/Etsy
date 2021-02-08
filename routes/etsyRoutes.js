const router = require('express').Router();

const EtsyController = require('../controllers/EtsyController');
const auth = require('../middlewares/auth');

router.get('/taxonomy/seller/get', auth, (req, res) => {
  EtsyController.getSellerTaxonomy(req)
    .then((data) => res.status(200).send(data))
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

router.post('/listings/create', auth, (req, res) => {
  EtsyController.createListing(req, res)
    .then((data) => res.status(200).send(data))
    .catch((error) => {
      console.log(error);
      res.status(500).send({
        message: 'hi'
      });
    });
});

router.get('/listings', auth, (req, res) => {
  EtsyController.getListings(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

router.get('/listing/:id', auth, (req, res) => {
  EtsyController.getListing(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

router.get('/oAuth', (req, res) => {
  EtsyController.oAuth(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) =>
      res.status(status).send({
        message
      })
    );
});

router.get('/oAuth/callback', (req, res) => {
  res.status(200).send({
    oauth_token: req.query.oauth_token,
    oauth_verifier: req.query.oauth_verifier
  });
});

router.post('/oAuth/callback', auth, (req, res) => {
  EtsyController.oAuthCallback(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) => {
      return res.status(status).send({
        message
      });
    });
});

router.get('/oauth/scope', auth, (req, res) => {
  EtsyController.getOAuthScope(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) => {
      return res.status(status).send({
        message
      });
    });
});

router.get('/users/shipping/profile', auth, (req, res) => {
  EtsyController.getShippingProfile(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) => {
      return res.status(status).send({
        message
      });
    });
});

router.post('/users/shipping', auth, (req, res) => {
  EtsyController.createShipping(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) => {
      return res.status(status).send({
        message
      });
    });
});

router.get('/countries', auth, (req, res) => {
  EtsyController.getCountries(req)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(({ status, message }) => {
      return res.status(status).send({
        message
      });
    });
});

module.exports = router;
