const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.resolve(__dirname, 'apps/frontend/tailwind.config.js'),
    },
    autoprefixer: {},
  },
};
