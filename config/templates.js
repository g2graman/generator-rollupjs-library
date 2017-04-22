'use strict';

const _ = require('lodash');

const YARN_TOKEN = 'yarn';
const NPM_SHRINKWRAP_TOKEN = 'shrinkwrap';
const AVA_TOKEN = 'ava';
const AVA_WITH_CODE_COVERAGE_TOKEN = 'avaAndNyc';
const MOCHA_TOKEN = 'mocha';
const MOCHA_WITH_CODE_COVERAGE_TOKEN = 'mochaAndistanbul';

const negatePatternsIfFalse = function (flag, patternList) {
  return !!flag
    ? patternList
    : patternList.map(pattern => `!${pattern}`);
};

module.exports = function (answers) {
  const ENV_CONTEXT = {
    USE_BABEL: _.get(answers, 'useBabel'),
    ISTANBUL_CODE_COVERAGE: _.get(answers, 'makeTests') === MOCHA_WITH_CODE_COVERAGE_TOKEN,
    NYC_CODE_COVERAGE: _.get(answers, 'makeTests') === AVA_WITH_CODE_COVERAGE_TOKEN,
    MAKE_TESTS: !!_.get(answers, 'makeTests'),
    SHOULD_LINT: !!_.get(answers, 'shouldLint'),
    BUILD_EXAMPLE: !!_.get(answers, 'useExample'),
    LOCK_DEPENDENCIES: !!_.get(answers, 'lockDependencies'),
    LOCK_DEPENDENCIES_SHRINKWRAP: _.get(answers, 'lockDependencies') === NPM_SHRINKWRAP_TOKEN,
    LOCK_DEPENDENCIES_YARN: _.get(answers, 'lockDependencies') === YARN_TOKEN
  };

  const SOURCE_TEMPLATES_PATTERNS = Array.prototype.concat.apply(
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
            './templates/**/*test*'
          ]
      ), negatePatternsIfFalse(
          _.get(ENV_CONTEXT, 'MAKE_TESTS') === MOCHA_TOKEN ||
            _.get(ENV_CONTEXT, 'MAKE_TESTS') === MOCHA_WITH_CODE_COVERAGE_TOKEN, [
              './templates/**/*mocha*',
            ]
      ), negatePatternsIfFalse(
          _.get(ENV_CONTEXT, 'ISTANBUL_CODE_COVERAGE'), [
            './templates/**/*istanbul*',
          ]
      ), negatePatternsIfFalse(
        _.get(ENV_CONTEXT, 'NYC_CODE_COVERAGE'), [
          './templates/**/*nyc*',
        ]
      ), negatePatternsIfFalse(
          !!_.get(ENV_CONTEXT, 'BUILD_EXAMPLE'), [
            './templates/**/*lib*',
            './templates/**/lib/**/*'
          ]
      ), negatePatternsIfFalse(
          !!_.get(ENV_CONTEXT, 'LOCK_DEPENDENCIES') &&
            _.get(ENV_CONTEXT, 'LOCK_DEPENDENCIES_YARN'), [
              './templates/**/*yarn.lock*'
            ]
      ), negatePatternsIfFalse(
          !!_.get(ENV_CONTEXT, 'LOCK_DEPENDENCIES') &&
            _.get(ENV_CONTEXT, 'LOCK_DEPENDENCIES_SHRINKWRAP'), [
              './templates/**/*npm-shrinkwrap*'
            ]
      )
    ]);

  const PACKAGE_TEMPLATE_RESOLVER_MAP = {
    babel: {
      flag: 'USE_BABEL',
      packagePattern: /babel/i
    }, test: {
      flag: 'MAKE_TESTS',
      packagePattern: /mocha/i
    }, istanbulCoverage: {
      flag: 'ISTANBUL_CODE_COVERAGE',
      packagePattern: /istanbul/i,
    }, nycCoverage: {
      flag: 'NYC_CODE_COVERAGE',
      packagePattern: /nyc/i,
    }, lint: {
      flag: 'SHOULD_LINT',
      packagePattern: /eslint/i
    }, yarn: {
      flag: 'LOCK_DEPENDENCIES_YARN',
      packagePattern: /yarn/i
    }
  };

  return _.assign(
    _.merge({
        ENV_CONTEXT,
      }, ENV_CONTEXT
    ), {
      SOURCE_TEMPLATES_PATTERNS,
      SOURCE_TEMPLATES_PATTERNS,
      PACKAGE_TEMPLATE_RESOLVER_MAP
    }
  )
};

module.exports.TOKENS = {
  YARN_TOKEN,
  NPM_SHRINKWRAP_TOKEN,
  AVA_TOKEN,
  AVA_WITH_CODE_COVERAGE_TOKEN,
  MOCHA_TOKEN,
  MOCHA_WITH_CODE_COVERAGE_TOKEN
};
