# rode-ui

## Local Development

To run `rode-ui` locally, you'll need Node.js, [`yarn`](https://yarnpkg.com/), and, optionally, [`nvm`](https://github.com/nvm-sh/nvm).

You'll also need to have [Rode](https://github.com/rode/rode) running -- by default the application expects Rode to be on `http://localhost:50052`.
To configure a different URL, set the environment variable `RODE_URL`.

1. Configure the Node.js version with `nvm use`.
1. Install dependencies with `yarn`.
1. Start the application using `yarn dev`.
1. Run [`pretter`](https://prettier.io/), [`eslint`](https://eslint.org/), and tests with `yarn verify`.
1. Fix any formatting errors using `yarn fmt`.

## Integration Testing

Integration testing for `rode-ui` are implemented using [`Cypress`](https://www.cypress.io/). Before running the integration tests for the first time, you may need to run `yarn install`.

1. Run the `rode-ui` locally by following the instructions above. Keep the application running in your terminal.
1. In a second terminal window, open the Cypress test runner by running `yarn e2e`. This will open a new application window on your computer.
   1. If you want to run the tests by hitting a locally run copy of [Rode](https://github.com/rode/rode), you can instead run the command `yarn e2e-local`. _Please note: some of the test assertions are based on the mocked responses, so running the tests against your local instance may result in test failures._
1. Run all tests by selecting the button in the top right of the test window, or run an individual test file by selecting the name of the file. For example, to run resource tests you can select `resources.spec.js` from the list.
1. You can close Cypress by exiting the test runner window or by pressing `ctrl + c` in the terminal window where you ran `yarn e2e`.
