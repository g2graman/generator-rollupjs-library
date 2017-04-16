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

const negatePatternsIfFalse = function (flag, patternList) {
  return !!flag
    ? patternList
    : patternList.map(pattern => `!${pattern}`);
};

const TEMPLATES_TO_EXCLUDE = Array.prototype.concat.apply(
  [], [
    negatePatternsIfFalse(
      !!_.get(ENV_CONTEXT, 'USE_BABEL'), [
        './templates/**/.babelrc',
        './templates/**/*babel*'
      ]
    ), negatePatternsIfFalse(
      !!_.get(ENV_CONTEXT, 'SHOULD_LINT'), [
        './templates/**/.eslintrc',
        './templates/**/*eslint*'
      ]
    ), negatePatternsIfFalse(
      !!_.get(ENV_CONTEXT, 'MAKE_TESTS'), [
        './templates/**/*mocha*',
        './templates/**/*test*'
      ]
    ), negatePatternsIfFalse(
      !!_.get(ENV_CONTEXT, 'CODE_COVERAGE'), [
        './templates/**/*istanbul*',
      ]
    ), negatePatternsIfFalse(
      !!_.get(ENV_CONTEXT, 'BUILD_EXAMPLE'), [
        './templates/**/*lib*',
        './templates/**/lib/**/*'
      ]
    )
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
