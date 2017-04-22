'use strict';

const path = require('path');
const gulp = require('gulp');
const _ = require('lodash');
const Validator = require('validator');
const EOL = require('os').EOL;
const Promise = require('bluebird');

const exec = require('child-process-promise').exec;
const request = require('request-promise');
const cheerio = require('cheerio');

const TOKENS = require('./templates').TOKENS;

const DEFAULT_PROJECT_NAME = process.cwd().split(path.sep).pop();

const getGlobalGitConfig = function () {
  return exec('git config --global -l')
    .then(function (gitConfigBuffer) {

      if (gitConfigBuffer.error) {
        console.error(gitConfigBuffer.error);
        throw new Error(gitConfigBuffer.error)
      }

      return _.reduce(
        _.fromPairs(
          gitConfigBuffer.stdout.toString('utf8')
            .split(EOL)
            .filter(Boolean)
            .map(elem => elem.split('='))
        ), (acc, value, key) => {
          _.set(acc, key, value);
          return acc;
        }, {}
      );
    }).then(function (GlobalGitConfig) {
      return {
        DEFAULT_AUTHOR_NAME: _.get(GlobalGitConfig, 'user.name')
          || process.env.USER
          || '',
        DEFAULT_AUTHOR_EMAIL: _.get(GlobalGitConfig, 'user.email')
          || ''
      }
    });
};

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
        name: 'No / I\'ll decide later',
        value: false
      });

      return result;
    });
};

const makeMetaDataPrompts = function (context) {
  const DEFAULT_AUTHOR_NAME = _.get(context, 'DEFAULT_AUTHOR_NAME');
  const DEFAULT_AUTHOR_EMAIL = _.get(context, 'DEFAULT_AUTHOR_EMAIL');

  return {
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
};

const PROMPTS_AFTER_LICENSE = {
  makeTests: {
    type: 'list',
    message: 'Would you like to generate tests?',
    default: TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN,
    choices: [{
      name: 'Yes, using ava',
      value: TOKENS.AVA_TOKEN
    }, {
      name: 'Yes, using ava (with code coverage using nyc)',
      value: TOKENS.AVA_WITH_CODE_COVERAGE_TOKEN
    }, {
      name: 'Yes, using mocha',
      value: TOKENS.MOCHA_TOKEN
    }, {
      name: 'Yes, using mocha (with code coverage using istanbul)',
      value: TOKENS.MOCHA_WITH_CODE_COVERAGE_TOKEN
    }, {
      name: 'No / I\'ll decide later',
      value: false
    }]
  }, shouldLint: {
    type: 'confirm',
    message: 'Would you like to set up eslint?',
    default: true
  }, useBabel: {
    type: 'confirm',
    message: 'Would you like to use babel?',
    default: true
  }, useExample: {
    type: 'confirm',
    message: 'Would you like to start with an example library?',
    default: true
  }, lockDependencies: {
    type: 'list',
    message: 'Would you like to lock dependency versions?',
    default: TOKENS.YARN_TOKEN,
    choices: [{
      name: 'Yes, using yarn',
      value: TOKENS.YARN_TOKEN
    }, {
      name: 'Yes, using shrinkwrap',
      value: TOKENS.NPM_SHRINKWRAP_TOKEN
    }, {
      name: 'No / I\'ll decide later',
      value: false
    }]
  }, downloadPackages: {
    type: 'confirm',
    message: 'Would you like to start downloading the necessary dependencies now?',
    default: true
  },
};

module.exports = function() {
  return Promise.all([
    getGlobalGitConfig(),
    getLicenses()
  ]).then(function (results) {
    let GlobalGitConfig = results.shift();
    let licenses = results.shift();

    return {
      GlobalGitConfig,
      licenses
    }
  }).then(function (context) {
    return {
      PROMPTS_UP_TO_LICENSE: makeMetaDataPrompts(
        _.get(
          context,
          'GlobalGitConfig'
        )
      ), LICENSE_PROMPTS: {
        license: {
          type: 'list',
          message: 'Would you like to pick a license (sourced from https://choosealicense.com/licenses/)?',
          default: false,
          choices: _.get(
            context,
            'licenses'
          )
        }
      }
    }
  }).then(function (existingPrompts) {
    return _.merge.apply(
      this,
      _.values(existingPrompts).concat([PROMPTS_AFTER_LICENSE])
    );
  });
};

module.exports.getGlobalGitConfig = getGlobalGitConfig;
module.exports.getLicenses = getLicenses;
