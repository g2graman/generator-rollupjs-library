'use strict';

const _ = require('lodash');

const USE_BABEL = false;
const CODE_COVERAGE = true;
const MAKE_TESTS = false;
const SHOULD_LINT = false;
const BUILD_EXAMPLE = false;

const ENV_CONTEXT = {
  USE_BABEL,
  MAKE_TESTS,
  CODE_COVERAGE: MAKE_TESTS && CODE_COVERAGE,
  SHOULD_LINT,
  BUILD_EXAMPLE
};

const TEMPLATES_TO_EXCLUDE = Array.prototype.concat.apply(
  [], [
    [
      (!!_.get(ENV_CONTEXT, 'USE_BABEL')
        ? ''
        : '!')
      + './templates/**/.babelrc',
      (!!_.get(ENV_CONTEXT, 'USE_BABEL')
        ? ''
        : '!')
      + './templates/**/*babel*'
    ], [
      (!!_.get(ENV_CONTEXT, 'SHOULD_LINT')
        ? ''
        : '!')
      + './templates/**/.eslintrc',
      (!!_.get(ENV_CONTEXT, 'SHOULD_LINT')
        ? ''
        : '!')
      + './templates/**/*eslint*'
    ], [
      (!!_.get(ENV_CONTEXT, 'MAKE_TESTS')
        ? ''
        : '!')
      + './templates/**/*mocha*',
      (!!_.get(ENV_CONTEXT, 'MAKE_TESTS')
        ? ''
        : '!')
      + './templates/**/*test*',
    ], [
      (!!_.get(ENV_CONTEXT, 'CODE_COVERAGE')
        ? ''
        : '!')
      + './templates/**/*istanbul*'
    ], [
      (!!_.get(ENV_CONTEXT, 'BUILD_EXAMPLE')
        ? ''
        : '!')
      + './templates/**/*lib*',
      (!!_.get(ENV_CONTEXT, 'BUILD_EXAMPLE')
        ? ''
        : '!')
      + './templates/**/lib/**/*'
    ]
]);

module.exports = {
  ENV_CONTEXT,
  USE_BABEL,
  MAKE_TESTS,
  CODE_COVERAGE,
  SHOULD_LINT,
  BUILD_EXAMPLE,
  TEMPLATES_TO_EXCLUDE
};
