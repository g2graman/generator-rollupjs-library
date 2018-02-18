import { FLAGS } from '../env/flags';

import { FLAG_MAP_TYPE } from '../../lib/env/flags';

export const FLAG_MAP: FLAG_MAP_TYPE = {
  babel: {
    flag: FLAGS.USE_BABEL_FLAG,
    packagePattern: /babel/i,
    templatePatterns: [
      './templates/**/.babelrc',
      './templates/**/*babel*'
    ]
  }, example: {
    flag: FLAGS.BUILD_EXAMPLE_FLAG,
    templatePatterns: [
      './templates/**/*lib*/**/*'
    ]
  },test: {
    flag: FLAGS.MAKE_TESTS_FLAG,
    // No related package
    templatePatterns: [
      './templates/**/*test*',
      './templates/**/test(s)?'
    ]
  }, ava: {
    flag: FLAGS.USE_AVA_FLAG,
    dependsOn: FLAGS.MAKE_TESTS_FLAG,
    packagePattern: /ava/i,
    templatePatterns: [
      './templates/**/*ava*',
      './templates/**/test/*ava*/**/*',
    ]
  }, mocha: {
    flag: FLAGS.USE_MOCHA_FLAG,
    dependsOn: FLAGS.MAKE_TESTS_FLAG,
    packagePattern: /mocha/i,
    templatePatterns: [
      './templates/**/*mocha*',
      './templates/**/test/*mocha*/**/*',
    ]
  }, istanbul: {
    flag: FLAGS.CODE_COVERAGE_ISTANBUL_FLAG,
    dependsOn: FLAGS.CODE_COVERAGE_FLAG,
    packagePattern: /istanbul/i,
    templatePatterns: [
      './templates/**/*istanbul*',
    ]
  }, nyc: {
    flag: FLAGS.CODE_COVERAGE_NYC_FLAG,
    dependsOn: FLAGS.CODE_COVERAGE_FLAG,
    packagePattern: /nyc/i,
  }, lint: {
    flag: FLAGS.SHOULD_LINT_FLAG,
    packagePattern: /eslint/i,
    templatePatterns: [
      './templates/**/.eslintrc',
      './templates/**/*eslint*'
    ]
  }, dependencies: {
    // No related package
    flag: FLAGS.LOCK_DEPENDENCIES_FLAG,
  }, shrinkwrap: {
    flag: FLAGS.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG,
    dependsOn: FLAGS.LOCK_DEPENDENCIES_FLAG,
    templatePatterns: [
      './templates/**/*npm-shrinkwrap*'
    ]
  }, yarn: {
    flag: FLAGS.LOCK_DEPENDENCIES_YARN_FLAG,
    dependsOn: FLAGS.LOCK_DEPENDENCIES_FLAG,
    packagePattern: /yarn/i,
    templatePatterns: [
      './templates/**/*yarn.lock*'
    ]
  }
};

export default FLAG_MAP;
