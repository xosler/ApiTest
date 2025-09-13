const { defineConfig } = require("cypress");
require("dotenv").config(); 

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  e2e: {
    baseUrl: process.env.CYPRESS_API_URL,

    env: {
      CYPRESS_X_API_KEY: process.env.CYPRESS_X_API_KEY
    },
    setupNodeEvents(on, config) {
          require('cypress-mochawesome-reporter/plugin')(on);
    },

    defaultCommandTimeout: 10000
  }
});
