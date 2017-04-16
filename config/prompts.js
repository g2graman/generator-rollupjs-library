'use strict';

const path = require('path');
const gulp = require('gulp');
const _ = require('lodash');
const Validator = require('validator');
const EOL = require('os').EOL;

const exec = require('child_process').execSync;
const request = require('request-promise');
const cheerio = require('cheerio');

const DEFAULT_PROJECT_NAME = path.dirname(__dirname).split(path.sep).pop();

let GlobalGitConfig = _.reduce(
  _.fromPairs(
    exec('git config --global -l').toString('utf8')
      .split(EOL)
      .filter(Boolean)
      .map(elem => elem.split('='))
  ), (acc, value, key) => {
    _.set(acc, key, value);
    return acc;
  }, {}
);

const DEFAULT_AUTHOR_NAME = _.get(GlobalGitConfig, 'user.name')
  || process.env.USER
  || '';

const DEFAULT_AUTHOR_EMAIL = _.get(GlobalGitConfig, 'user.email')
  || '';

const getLicenses = function () {
  return request('https://choosealicense.com/licenses/')
    .then(htmlLicenses => {
      let $ = cheerio.load(htmlLicenses, {
        normalizeWhitespace: true,
      });

      let result = _.map(
        $('div.license-overview'),
        (elem) => {
          let license = _.get(elem, 'attribs.id');
          return {
            name: `Yes, ${license}`,
            value: _.upperCase(license).split(' ').join('-')
          };
        }
      );

      result.push({
        name: 'No',
        value: false
      });

      return result;
    });
};

const PROMPTS_UP_TO_LICENSE = {
  libraryName: {
    type: 'input',
    message: 'What is the name of your library? [Optional]',
    default: _.kebabCase(
        DEFAULT_PROJECT_NAME
      )
  }, authorName: {
    message: 'What is your name? [Optional] (e.g., John Smith)',
    default: DEFAULT_AUTHOR_NAME,
  }, authorWebsite: {
    message: 'What is the URL of your website? [Optional] (e.g., www.example.com)',
    validate: (urlCandidate) => (
      urlCandidate.length === 0
        || Validator.isURL(urlCandidate)
      ) ? true
        : 'What you provided was not a website URL'
  }, authorEmail: {
    message: 'What is your e-mail address? [Optional] (e.g., contact@example.com)',
    default: DEFAULT_AUTHOR_EMAIL,
    validate: (emailCandidate) => (
      emailCandidate.length === 0
        || Validator.isEmail(emailCandidate)
      ) ? true
      : 'What you provided was not an e-mail'
  }
};

const PROMPTS_AFTER_LICENSE = {
  makeTests: {
    type: 'list',
    message: 'Would you like to generate tests?',
    default: false,
    choices: [{
      name: 'Yes, using ava',
      value: 'ava'
    }, {
      name: 'Yes, using mocha',
      value: 'mocha'
    }, {
      name: 'Yes, using mocha (with code coverage using istanbul)',
      value: 'mochaAndistanbul'
    }, {
      name: 'No',
      value: false
    }]
  }, shouldLint: {
    type: 'confirm',
    message: 'Would you like to set up eslint?',
    default: false
  }
};

module.exports = function() {
  return getLicenses().then(licenseChoices => {
    return _.merge(PROMPTS_UP_TO_LICENSE, {
      license: {
        type: 'list',
        message: 'Would you like to pick a license (sourced from https://choosealicense.com/licenses/)?',
        default: false,
        choices: licenseChoices
      }
    }, PROMPTS_AFTER_LICENSE);
  });
};

module.exports.getLicenses = getLicenses;
