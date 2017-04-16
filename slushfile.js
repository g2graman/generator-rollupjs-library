'use strict';

const packageJson = require('./package.json');

const gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    config: packageJson
  }), argv = require('yargs').argv,
  _ = require('lodash'),
  inquirer = require('inquirer'),
  del = require('del');

const TemplateConfig = require('./config/templates');
const Helpers = require('./lib/templates');
const getPrompts = require('./config/prompts');

gulp.task('clean:rollup', function (done) {
  return del([
    './dist/'
  ], done);
});

gulp.task('clean', ['clean:rollup']);

gulp.task('pre:rollup', function() {
  const packageJsonFilter = $.filter(['**/*/package.json'], {
    restore: true
  });

  return gulp.src([
    './templates/**/*',
    './templates/**/\.*',
    '!./templates/**/\.git'
  ].concat(
    TemplateConfig.TEMPLATES_TO_EXCLUDE
  )).pipe(packageJsonFilter)
    .pipe(Helpers.resolveDependencies(TemplateConfig.ENV_CONTEXT))
    .pipe(packageJsonFilter.restore)
    .pipe($.preprocess({
      context: TemplateConfig.ENV_CONTEXT
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['clean'], function () {
  let dir = _.get(argv, 'dir') || __dirname;

  return getPrompts.call(this).then(PROMPTS => {
    let inquiryPrompts = Helpers.convertPrompts(PROMPTS);

    return inquirer.prompt(inquiryPrompts).then(function (answers) {
      $.util.log('Answers: ' + JSON.stringify(answers));

      return gulp.start('pre:rollup');
    });
  })
});
