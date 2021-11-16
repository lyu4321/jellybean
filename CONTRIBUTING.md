# Contributing

## Prerequisites

-   Fork and clone this project
-   Download [Node.js (npm)](https://nodejs.org/en/download/) (version 14+)
-   Install dependencies using `npm install`

## Prettier

This repository uses [Prettier](https://prettier.io/) for formatting. To format your code, please run:

`npm run prettier`

To format files

`npm run prettier-check`

To check if files are formatted

## ESLint

This repository uses [ESLint](https://eslint.org/) to check for errors. To check your code, please run:

`npm run eslint`

To check for errors

`npm run eslint-fix`

To automatically fix errors

## Husky

This repository uses [Husky](https://typicode.github.io/husky/#/) as a pre-commit hook.

## Jest

This repository uses [Jest](https://jestjs.io/) for testing. To test, please run:

`npm run test`

To run the tests once

`npm run test:watch`

To run the tests automatically whenever changes are made

`jest --collectCoverage --`

To run the tests and get a coverage report

To create tests for new code, please follow the Jest [docs](https://jestjs.io/docs/getting-started).
