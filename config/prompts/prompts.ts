'use strict';

/// <reference path="../../node_modules/@types/node/index.d.ts" />

import * as path from 'path';
// import * as gulp from 'gulp';

import {
  reduce,
  fromPairs,
  set,
  get,
  upperCase,
  kebabCase,
  map,
  merge,
  values
} from 'lodash';

import * as Validator from 'validator';
import { EOL } from 'os';
import * as Promise from 'bluebird';

import { exec } from 'child-process-promise';
import * as request from 'request-promise';
import * as cheerio from 'cheerio';

import { TOKENS } from '../tokens';

import {
  default as inquirer,
  Prompts
} from "inquirer";

import Choice = inquirer.objects.Choice;



const DEFAULT_PROJECT_NAME: string = process
  .cwd()
  .split(path.sep)
  .pop();

const getGlobalGitConfig = function (): PromiseLike {
  return exec('git config --global -l')
    .then(function (gitConfigBuffer) {

      if (gitConfigBuffer.error) {
        console.error(gitConfigBuffer.error);
        throw new Error(gitConfigBuffer.error)
      }

      return reduce(
        fromPairs(
          gitConfigBuffer.stdout.toString('utf8')
            .split(EOL)
            .filter(Boolean)
            .map(elem => elem.split('='))
        ), (acc, value, key) => {
          set(acc, key, value);
          return acc;
        }, {}
      );
    }).then(function (GlobalGitConfig) {
      return {
        DEFAULT_AUTHOR_NAME: get(
          GlobalGitConfig,
          'user.name',
          process.env.USER || ''
        ),
        DEFAULT_AUTHOR_EMAIL: get(GlobalGitConfig, 'user.email', '')
      }
    });
};

const getLicenses = function (): Promise<Choice[]> {
  return request('https://choosealicense.com/licenses/')
    .then(htmlLicenses => {
      let $ = cheerio.load(htmlLicenses, {
        normalizeWhitespace: true,
      });

      let result: Choice[] = map(
        $('div.license-overview'),
        (elem) => {
          let license = get(elem, 'attribs.id');

          return {
            name: license
              ? `Yes, ${license}`
              : null,
            value: upperCase(license).split(' ').join('-')
          };
        }
      );

      result.push({
        name: 'No / I\'ll decide later',
        value: false
      });

      return result.filter(choice => Boolean(choice.name));
    });
};

export enum PromptType {
  LIST = 'list',
  CONFIRM = 'confirm',
  INPUT = 'input',
  RAWLIST = 'rawlist',
  PASSWORD = 'password'
}

const makeMetaDataPrompts = function (context): Prompts {
  const DEFAULT_AUTHOR_NAME = get(context, 'DEFAULT_AUTHOR_NAME', null);
  const DEFAULT_AUTHOR_EMAIL = get(context, 'DEFAULT_AUTHOR_EMAIL', null);

  return {
    libraryName: {
      type: PromptType.INPUT,
      message: 'What is the name of your library? [Optional]',
      default: kebabCase(
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

const PROMPTS_AFTER_LICENSE: Prompts = {
  makeTests: {
    type: PromptType.LIST,
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
    type: PromptType.CONFIRM,
    message: 'Would you like to set up eslint?',
    default: true
  }, useBabel: {
    type: PromptType.CONFIRM,
    message: 'Would you like to use babel?',
    default: true
  }, useExample: {
    type: PromptType.CONFIRM,
    message: 'Would you like to start with an example library?',
    default: true
  }, lockDependencies: {
    type: PromptType.LIST,
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
    type: PromptType.CONFIRM,
    message: 'Would you like to start downloading the necessary dependencies now?',
    default: true
  },
};

export default function (): PromiseLike {
  return Promise.all([
    getGlobalGitConfig(),
    getLicenses()
  ]).then(function (results) {
    let [
      GlobalGitConfig,
      licenses
    ] = results;

    return {
      GlobalGitConfig,
      licenses
    };
  }).then(function (context) {
    return <{[key: string]: Prompts}> {
      PROMPTS_UP_TO_LICENSE: <Prompts> makeMetaDataPrompts(
        get(
          context,
          'GlobalGitConfig',
          {}
        )
      ), LICENSE_PROMPTS: {
        license: {
          type: PromptType.LIST,
          message: 'Would you like to pick a license (sourced from https://choosealicense.com/licenses/)?',
          default: false,
          choices: get(
            context,
            'licenses',
            []
          )
        }
      }
    }
  }).then(function (existingPrompts: {[key: string]: Prompts}): Prompts {
    return merge.apply(
      this,
      values(existingPrompts).concat([PROMPTS_AFTER_LICENSE])
    );
  });
};

export {
  getGlobalGitConfig,
  getLicenses,
};
