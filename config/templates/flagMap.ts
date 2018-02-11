import { FLAGS } from '../env/flags';

export const FLAG_MAP = {
  babel: {
    flag: FLAGS.USE_BABEL_FLAG,
    packagePattern: /babel/i
  }, test: {
    flag: FLAGS.MAKE_TESTS_FLAG,
    packagePattern: /mocha/i
  }, istanbulCoverage: {
    flag: FLAGS.ISTANBUL_CODE_COVERAGE_FLAG,
    packagePattern: /istanbul/i,
  }, nycCoverage: {
    flag: FLAGS.NYC_CODE_COVERAGE_FLAG,
    packagePattern: /nyc/i,
  }, lint: {
    flag: FLAGS.SHOULD_LINT_FLAG,
    packagePattern: /eslint/i
  }, yarn: {
    flag: FLAGS.LOCK_DEPENDENCIES_YARN_FLAG,
    packagePattern: /yarn/i
  }
};

export default FLAG_MAP;
