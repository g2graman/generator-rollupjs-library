import { get } from 'lodash';

import { FLAGS } from '../env/flags';

const negatePatternsIfFalse = function (flag, patternList) {
  return !!flag
    ? patternList
    : patternList.map(pattern => `!${pattern}`);
};

export const getSourceTemplatePatterns = (envContext) => Array.prototype.concat.apply(
  [], [
    negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_BABEL_FLAG), [
        './templates/**/.babelrc',
        './templates/**/*babel*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.SHOULD_LINT_FLAG), [
        './templates/**/.eslintrc',
        './templates/**/*eslint*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.MAKE_TESTS_FLAG), [
        './templates/**/*test*',
        './templates/**/test(s)?'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_MOCHA_FLAG),  [
        './templates/**/*mocha*',
        './templates/**/test/*mocha*/**/*',
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_AVA_FLAG),  [
        './templates/**/*ava*',
        './templates/**/test/*ava*/**/*',
      ]
    ), negatePatternsIfFalse(
      get(envContext, FLAGS.ISTANBUL_CODE_COVERAGE_FLAG), [
        './templates/**/*istanbul*',
      ]
    ), negatePatternsIfFalse(
      get(envContext, FLAGS.NYC_CODE_COVERAGE_FLAG), [
        './templates/**/*nyc*',
        './templates/**/\.nycrc',
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.BUILD_EXAMPLE_FLAG), [
        './templates/**/*lib*/**/*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.LOCK_DEPENDENCIES_FLAG) &&
      get(envContext, FLAGS.LOCK_DEPENDENCIES_YARN_FLAG), [
        './templates/**/*yarn.lock*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.LOCK_DEPENDENCIES_FLAG) &&
      get(envContext, FLAGS.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG), [
        './templates/**/*npm-shrinkwrap*'
      ]
    )
  ]);

export default getSourceTemplatePatterns;
