// config.js
const dotenv = require("dotenv");

dotenv.config();
// Export env variables
module.exports = {
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  STRIPE_KEY: process.env.STRIPE_KEY,
};
