'use strict';

const packageJson = require('./package.json');

const gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    config: packageJson
  }), argv = require('yargs').argv,
  _ = require('lodash'),
  inquirer = require('inquirer');

const Helpers = require('./lib');
const getPrompts = require('./prompts/prompts');

const USE_BABEL = false;
const CODE_COVERAGE = false;
const MAKE_TESTS = false;
const SHOULD_LINT = false;

const OTHER_TEMPLATES = Array.prototype.concat.apply(
  [], [
    USE_BABEL
      ? ['./templates/**/.babelrc']
      : [],
    SHOULD_LINT
      ? ['./templates/**/.eslintrc']
      : []
  ]
);

const ENV_CONTEXT = {
  USE_BABEL,
  MAKE_TESTS,
  CODE_COVERAGE: MAKE_TESTS && CODE_COVERAGE,
  SHOULD_LINT
};

console.log(OTHER_TEMPLATES);

gulp.task('pre:rollup', function() {
  const packageJsonFilter = $.filter(['**/*/package.json'], {
    restore: true
  });

  gulp.src([
    './templates/**/rollup.config.js',
    './templates/*/package.json'
  ].concat(
    OTHER_TEMPLATES
  )).pipe($.debug())
    .pipe(packageJsonFilter)
    .pipe(Helpers.resolveDependencies(ENV_CONTEXT))
    .pipe(packageJsonFilter.restore)
    .pipe($.preprocess({
      context: ENV_CONTEXT
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('default', function (done) {
  let dir = _.get(argv, 'dir') || __dirname;
  let inquiryPrompts = Helpers.convertPrompts(getPrompts.call(this));

  return inquirer.prompt(inquiryPrompts,
    function (answers) {
      $.util.log(answers);
      return done();
    }
  );
});
