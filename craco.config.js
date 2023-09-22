/* craco.config.js */
const path = require(`path`);

module.exports = {
  webpack: {
    alias: {
      '@models': path.resolve(__dirname, 'src/models'),
    }
  },
};