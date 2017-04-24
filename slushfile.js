'use strict';

const packageJson = require('./package.json');

const gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    config: packageJson
  }), argv = require('yargs').argv,
  _ = require('lodash'),
  inquirer = require('inquirer'),
  del = require('del');

let dir = _.get(argv, 'dir') || './dist';
let AnswersCache = {};

const getTemplateConfig = require('./config/templates');
const TemplateHelpers = require('./lib/templates');
const PromptsHelpers = require('./lib/prompts');
const getPrompts = require('./config/prompts');

gulp.task('clean:rollup', function (done) {
  return del([
    dir
  ], done);
});

gulp.task('clean', ['clean:rollup']);

gulp.task('pre:rollup', function () {

  const packageJsonFilter = $.filter(['**/*/package.json'], {
    restore: true
  });

  let TemplateConfig = getTemplateConfig(AnswersCache);
  console.log(TemplateConfig);

  return gulp.src([
    './templates/**/*',
    './templates/**/\.*', // include all 'hidden' files that start with a '.'
    '!./templates/**/\.git' //exclude git
  ].concat(
    TemplateConfig.SOURCE_TEMPLATES_PATTERNS
  )).pipe(packageJsonFilter)
    .pipe(TemplateHelpers.resolvePackageDependencies(TemplateConfig.ENV_CONTEXT))
    .pipe(packageJsonFilter.restore)
    .pipe($.preprocess({
      context: TemplateConfig.ENV_CONTEXT
    }))
    .pipe(gulp.dest(dir));
});

gulp.task('default', ['clean'], function () {
  return getPrompts.call(this).then(PROMPTS => {
    let inquiryPrompts = PromptsHelpers.convertPrompts(PROMPTS);

    return inquirer.prompt(inquiryPrompts).then(function (answers) {
      AnswersCache = _.assign(AnswersCache, answers);
      return gulp.start('pre:rollup');
    });

  })
});
