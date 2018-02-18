export type FLAG = string;
export type PATTERN = RegExp;
export type FLAG_MAP_TYPE = {
  [key: string]: {
    flag: FLAG;
    dependsOn?: FLAG;
    packagePattern?: PATTERN;
    templatePatterns: PATTERN[] | string[];
  }
};

import { get } from 'lodash';

import { FLAGS } from '../../config/env/flags';

const negatePatternsIfFalse = function (flag, patternList) {
  return !!flag
    ? patternList
    : patternList.map(pattern => `!${pattern}`);
};

// TODO: RECURSE THROUGH FLAG MAP TO && ALL DEPENDENCY FLAGS OF CSP
// TODO: re-implement getSourceTemplatePatterns
// TODO: Optimize recursion order? Add memoization?
export const getSourceTemplatePatterns = (envContext) => Array.prototype.concat.apply(
  [], [
    negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_BABEL_FLAG), [
        './templates/!**!/.babelrc',
        './templates/!**!/!*babel*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.SHOULD_LINT_FLAG), [
        './templates/!**!/.eslintrc',
        './templates/!**!/!*eslint*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.MAKE_TESTS_FLAG), [
        './templates/!**!/!*test*',
        './templates/!**!/test(s)?'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_MOCHA_FLAG),  [
        './templates/!**!/!*mocha*',
        './templates/!**!/test/!*mocha*!/!**!/!*',
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.USE_AVA_FLAG),  [
        './templates/!**!/!*ava*',
        './templates/!**!/test/!*ava*!/!**!/!*',
      ]
    ), negatePatternsIfFalse(
      get(envContext, FLAGS.CODE_COVERAGE_ISTANBUL_FLAG), [
        './templates/!**!/!*istanbul*',
      ]
    ), negatePatternsIfFalse(
      get(envContext, FLAGS.CODE_COVERAGE_NYC_FLAG), [
        './templates/!**!/!*nyc*',
        './templates/!**!/\.nycrc',
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.BUILD_EXAMPLE_FLAG), [
        './templates/!**!/!*lib*!/!**!/!*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.LOCK_DEPENDENCIES_FLAG) &&
      get(envContext, FLAGS.LOCK_DEPENDENCIES_YARN_FLAG), [
        './templates/!**!/!*yarn.lock*'
      ]
    ), negatePatternsIfFalse(
      !!get(envContext, FLAGS.LOCK_DEPENDENCIES_FLAG) &&
      get(envContext, FLAGS.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG), [
        './templates/!**!/!*npm-shrinkwrap*'
      ]
    )
  ]);

export default getSourceTemplatePatterns;
