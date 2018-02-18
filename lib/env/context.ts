// TODO: Simplify to CSPs ?
import { get } from 'lodash';

import { FLAGS } from "../../config/env/flags";
import { TOKENS } from "../../config/tokens";
import { EnvPath } from "./path";

export const getEnvContextFromAnswers = (answers) => ({
  [FLAGS.USE_BABEL_FLAG]: get(
    answers,
    EnvPath.get(FLAGS.USE_BABEL_FLAG)
  ),

  [FLAGS.CODE_COVERAGE_ISTANBUL_FLAG]: get(
    answers,
    EnvPath.get(FLAGS.CODE_COVERAGE_ISTANBUL_FLAG)
  ) === TOKENS.MOCHA_WITH_CODE_COVERAGE_TOKEN,

  [FLAGS.USE_AVA_FLAG]: get(
    answers,
    EnvPath.get('MAKE_TESTS')
  ) === TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN
    || get(
        answers,
        EnvPath.get('MAKE_TESTS')
      ) === TOKENS.AVA_TOKEN,

  [FLAGS.USE_MOCHA_FLAG]: get(
    answers,
    EnvPath.get('MAKE_TESTS')
  ) === TOKENS.MOCHA_WITH_CODE_COVERAGE_TOKEN
    || get(
        answers,
        EnvPath.get('MAKE_TESTS')
      ) === TOKENS.MOCHA_TOKEN,

  [FLAGS.CODE_COVERAGE_NYC_FLAG]: get(
    answers,
    EnvPath.get('MAKE_TESTS')
  ) === TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN,

  [FLAGS.MAKE_TESTS_FLAG]: !!get(
    answers,
    EnvPath.get(FLAGS.MAKE_TESTS_FLAG)
  ),

  [FLAGS.SHOULD_LINT_FLAG]: !!get(
    answers,
    EnvPath.get('MAKE_TESTS')
  ),

  [FLAGS.BUILD_EXAMPLE_FLAG]: !!get(
    answers,
    EnvPath.get(FLAGS.BUILD_EXAMPLE_FLAG)
  ),

  [FLAGS.LOCK_DEPENDENCIES_FLAG]: !!get(
    answers,
    EnvPath.get(FLAGS.LOCK_DEPENDENCIES_FLAG)
  ),

  [FLAGS.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG]: get(
    answers,
    EnvPath.get(FLAGS.LOCK_DEPENDENCIES_FLAG)
  ) === TOKENS.NPM_SHRINKWRAP_TOKEN,

  [FLAGS.LOCK_DEPENDENCIES_YARN_FLAG]: get(
    answers,
    EnvPath.get(FLAGS.LOCK_DEPENDENCIES_FLAG)
  ) === TOKENS.YARN_TOKEN,
});

export default getEnvContextFromAnswers;
