'use strict';

const gulp = require('gulp'),
  util = require('gulp-util'),
  argv = require('yargs').argv,
  _ = require('lodash'),
  inquirer = require('inquirer');


    /*install = require('gulp-install'),
    conflict = require('gulp-conflict'),
    template = require('gulp-template'),
    rename = require('gulp-rename'),
    whichOs = require('which-os');*/

const Helpers = require('./lib');
const PROMPTS = require('./prompts/prompts');

gulp.task('default', function (done) {
  let dir = _.get(argv, 'dir') || __dirname;
  let inquiryPrompts = Helpers.convertPrompts(PROMPTS.call(this));

  return inquirer.prompt(inquiryPrompts,
    function (answers) {
      util.log(answers);
      return done();
    }
  );

  /*inquirer.prompt(prompts,
      function (answers) {
          if (!answers.appName) {
              console.log('Please provide an App Name to continue');
              return done();
          }
          if (!answers.instanceName) {
              console.log('We need a Firebase Instance to proceed. Check for more info here: http://goo.gl/Io7fLD');
              return done();
          }
          answers.appNameSlug = _.slugify(answers.appName);
          answers.appCamelizeName = _.camelize(answers.appName);
          answers.os = whichOs();

          gulp.src(__dirname + '/templates/!**')
              .pipe(template(answers))
              .pipe(rename(function (file) {
                  if (file.basename.indexOf('_') == 0) {
                      file.basename = file.basename.replace('_','.');
                  }
              }))
              .pipe(conflict('./'))
              .pipe(gulp.dest('./'))
              .pipe(install())
              .on('end', function () {
                  done();
              });
      });*/
});
