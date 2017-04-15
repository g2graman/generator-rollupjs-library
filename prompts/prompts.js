'use strict';

const path = require('path');
const gulp = require('gulp');
const _ = require('lodash');
const Validator = require('validator');

const DEFAULT_PROJECT_NAME = __dirname.split(path.sep).pop();

const PROMPTS = {
  appName: {
    type: "input",
    message: "What is the name of your library?",
    default: _.capitalize(
      _.camelCase(
        DEFAULT_PROJECT_NAME
      )
    )
  }/*, website: {
    message: 'What is the URL of your website?',
    store: true,
    validate: (urlCandidate) => (
      urlCandidate.length === 0
        || Validator.isURL(urlCandidate)
      ) ? true
        : 'What you provided was not a website URL'
  }, email: {
    message: 'What is your e-mail?',
    store: true,
    validate: (emailCandidate) => (
      emailCandidate.length === 0
        || Validator.isEmail(emailCandidate)
      ) ? true
      : 'What you provided was not an e-mail'
  }*/
};

module.exports = function() {
  return PROMPTS;
};
