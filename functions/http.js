const axios = require('axios');

/**
 * GET Method
 */

const get = async (url) => {
  try {
    const response = await axios.get(url);
    if (response) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  get
};
