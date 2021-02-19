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
