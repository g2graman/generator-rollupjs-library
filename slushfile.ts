'use strict';

const packageJson = require('./package.json');

const gulp = require('gulp'),
  $ = require('gulp-load-plugins')({
    config: packageJson
  }), argv = require('yargs').argv,
  { get, assign } = require('lodash'),
  inquirer = require('inquirer'),
  del = require('del'),
  path = require('path');

let dir = get(argv, 'dir') || './dist';
let AnswersCache = {};

const getTemplateConfig = require('./config/templates/templates').default;
const TemplateHelpers = require('./lib/templates');
const PromptsHelpers = require('./lib/prompts');
const getPrompts = require('./config/prompts/prompts').default;

gulp.task('clean:rollup', function (done) {
  return del([
    dir
  ], done);
});

gulp.task('clean', ['clean:rollup'], null);

gulp.task('pre:rollup', function () {

  const packageJsonFilter = $.filter([
    '**/*/package.json'
  ], {
    restore: true
  });

  let TemplateConfig = getTemplateConfig(AnswersCache);

  return gulp.src([
    './templates/**/*',
    './templates/**/\.*',

    '!./templates/**/\.git', //exclude git
    '!./templates/**/node_modules',
    '!./templates/**/node_modules/**/*',
    '!./templates/**/node_modules/**/\.*',
  ].concat(
    TemplateConfig.SOURCE_TEMPLATES_PATTERNS
  )).pipe($.debug())
    .pipe(packageJsonFilter)
    .pipe(TemplateHelpers.resolvePackageDependencies(TemplateConfig.ENV_CONTEXT))
    .pipe(packageJsonFilter.restore)
    .pipe($.preprocess({
      context: TemplateConfig.ENV_CONTEXT
    })).pipe(gulp.dest(dir));
});

gulp.task('deps:download:rollup', ['pre:rollup'], function () {
  let TemplateConfig = getTemplateConfig(AnswersCache);

  return gulp.src([
    path.resolve('.', dir, '**', 'package.json'),
    path.resolve('.', dir, '**', 'yarn.lock'),
    path.resolve('.', dir, '**', 'npm-shrinkwrap.json'),
    `!${path.resolve('.', dir, '**', 'node_modules')}`,
    `!${path.resolve('.', dir, '**', 'node_modules', '**', '*')}`
  ]).pipe($.if(
    !!get(TemplateConfig, 'ENV_CONTEXT.LOCK_DEPENDENCIES_SHRINKWRAP_FLAG'),
    $.install(),
    $.yarn()
  )).pipe(gulp.dest(dir));
});

gulp.task('default', ['clean'], function () {
  return getPrompts.call(this).then(PROMPTS => {
    let inquiryPrompts = PromptsHelpers.convertPrompts(PROMPTS);

    return inquirer.prompt(inquiryPrompts).then(function (answers) {
      AnswersCache = assign(AnswersCache, answers);

      if (!!get(AnswersCache, 'downloadPackages')) {
        return gulp.start('deps:download:rollup');
      } else {
        return gulp.start('pre:rollup');
      }
    });
  });
});
