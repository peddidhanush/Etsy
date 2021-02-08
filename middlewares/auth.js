const { verifyToken } = require('../functions/utils');

module.exports = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;
    if (!token) {
      res.sendStatus(401);
      const error = {
        message: 'Un-Authorized Access'
      };
      return next(error);
    }
    const decodedToken = verifyToken(token);
    req.userDetails = decodedToken;
    next();
  } catch (err) {
    res.sendStatus(401);
    const error = {
      message: 'Un-Authorized Access'
    };
    return next(error);
  }
};
