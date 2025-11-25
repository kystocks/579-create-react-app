const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    setupNodeEvents() {},
    specPattern: 'cypress/component/**/*.cy.{js,ts,jsx,tsx}',
    excludeSpecPattern: ['**/__snapshots__/*', '**/__image_snapshots__/*'],
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
  env: {
    'cypress-react-selector': {
      root: '#root',
    },
  },
  port: 61234,
  video: false,
  screenshotOnRunFailure: false,
});
