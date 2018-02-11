// TODO: Simplify to CSPs ?
import { get } from 'lodash';

import { FLAGS } from "./flags";
import { TOKENS } from "../tokens";
import { EnvPath } from "./path";

export const getEnvContextFromAnswers = (answers) => ({
  [FLAGS.USE_BABEL_FLAG]: get(answers, EnvPath.get('USE_BABEL')),

  [FLAGS.ISTANBUL_CODE_COVERAGE_FLAG]: get(answers, EnvPath.get('ISTANBUL_CODE_COVERAGE')) === TOKENS.MOCHA_WITH_CODE_COVERAGE_TOKEN,

  [FLAGS.USE_AVA_FLAG]: get(answers, EnvPath.get('MAKE_TESTS')) === TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN
    || get(answers, EnvPath.get('MAKE_TESTS')) === TOKENS.AVA_TOKEN,

  [FLAGS.USE_MOCHA_FLAG]: get(answers, EnvPath.get('MAKE_TESTS')) === TOKENS.MOCHA_WITH_CODE_COVERAGE_TOKEN
    || get(answers, EnvPath.get('MAKE_TESTS')) === TOKENS.MOCHA_TOKEN,

  [FLAGS.NYC_CODE_COVERAGE_FLAG]: get(answers, EnvPath.get('MAKE_TESTS')) === TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN,

  [FLAGS.MAKE_TESTS_FLAG]: !!get(answers, EnvPath.get('MAKE_TESTS')),

  [FLAGS.SHOULD_LINT_FLAG]: !!get(answers, EnvPath.get('MAKE_TESTS')),

  [FLAGS.BUILD_EXAMPLE_FLAG]: !!get(answers, EnvPath.get('MAKE_TESTS')),

  [FLAGS.LOCK_DEPENDENCIES_FLAG]: !!get(answers, EnvPath.get('LOCK_DEPENDENCIES')),
  [FLAGS.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG]: get(answers, EnvPath.get('LOCK_DEPENDENCIES')) === TOKENS.NPM_SHRINKWRAP_TOKEN,
  [FLAGS.LOCK_DEPENDENCIES_YARN_FLAG]: get(answers, EnvPath.get('LOCK_DEPENDENCIES')) === TOKENS.YARN_TOKEN,

  USE_NPM: !get(answers, EnvPath.get('LOCK_DEPENDENCIES'))
    || get(answers, EnvPath.get('LOCK_DEPENDENCIES')) !== TOKENS.YARN_TOKEN
});

export default getEnvContextFromAnswers;
