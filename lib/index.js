'use strict';

const _ = require('lodash');
const through = require('through2');
const fs = require('fs');
const gulp = require('gulp');


const convertPrompts = function(PROMPTS) {
  return _.map(PROMPTS, function (promptValue, promptKey) {
    return _.merge(
      promptValue, {
        name: promptKey
      }
    );
  });
};

const objectsIntersect = function () {
  let keysInCommon = _.intersection.apply(
    this,
    Array.from(arguments).map(_.keys)
  );

  return _.pick(
    _.assign.apply(
      {},
      Array.from(arguments)
    ), keysInCommon
  );
};

const genericResolver = function (FLAG=false, regEx, packageJsonObject) {
  let copyPackageJsonObject = _.clone(packageJsonObject);

  return _.assign.apply(
    {},
    [copyPackageJsonObject].concat([
        'dependencies',
        'devDependencies'
      ].map(depProp => {
        return {
          [depProp]: objectsIntersect(
            _.get(packageJsonObject, depProp),
            _.omitBy(
              _.get(copyPackageJsonObject, depProp),
              (dependencyVersion, packageDependency) => {
                return (!FLAG && regEx.test(packageDependency));
              }
            )
          )
        }
      })
    )
  )
};

const RESOLVER_MAP = {
  babel: {
    flag: 'USE_BABEL',
    pattern: /babel/i
  }, test: {
    flag: 'MAKE_TESTS',
    pattern: /mocha/i
  }, coverage: {
    flag: 'CODE_COVERAGE',
    pattern: /istanbul/i,
  }, lint: {
    flag: 'SHOULD_LINT',
    pattern: /eslint/i
  }
};

const makeResolvers = function (context) {
  return _.map(RESOLVER_MAP, (resolverInfo, resolverKey) => {
    return Function.prototype.bind.apply(
      genericResolver,
      [this].concat([
        !!_.get(
          context,
          _.get(resolverInfo, 'flag')
        ), _.get(resolverInfo, 'pattern')
      ])
    );
  });
};

const resolveDependencies = function (context) {
  return through.obj(function (chunk, enc, cb) {
    let packageJson = JSON.parse(chunk._contents.toString(enc));

    let resolvers = makeResolvers(context);

    let modifiedPackageJson = _.reduce(
      resolvers,
      (acc, resolver) => resolver(acc),
      packageJson
    );

    // rewrite file contents
    chunk._contents = Buffer.from(JSON.stringify(modifiedPackageJson, null, 2));
    return cb(null, chunk);
  })
};


module.exports = {
  convertPrompts,
  objectsIntersect,
  genericResolver,
  makeResolvers,
  resolveDependencies
};
