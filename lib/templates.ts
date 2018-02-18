'use strict';

import {
  map,
  get,
  pick,
  assign,
  omitBy,
  clone,
  intersection,
  keys,
  reduce,
} from 'lodash';

import * as through from 'through2';

import { FLAG_MAP } from '../config/templates/flagMap';

export const convertPrompts = function(PROMPTS) {
  return map(PROMPTS, (promptValue, promptKey) => ({
    ...promptValue,
    name: promptKey
  }));
};

export const objectsIntersect = function () {
  let keysInCommon = intersection.apply(
    this,
    Array.from(arguments).map(keys)
  );

  return pick(
    assign.apply(
      {},
      Array.from(arguments)
    ), keysInCommon
  );
};

export const genericResolver = function (FLAG=false, regEx, packageJsonObject) {
  let copyPackageJsonObject = clone(packageJsonObject);

  return {
    ... [copyPackageJsonObject].concat([
          'dependencies',
          'devDependencies'
        ].map(depProp => ({
          [depProp]: objectsIntersect(
            get(packageJsonObject, depProp),
            omitBy(
              get(copyPackageJsonObject, depProp),
              (dependencyVersion, packageDependency) => {
                return (!FLAG && regEx.test(packageDependency));
              }
            )
          )
        }))
      )
  };
};

export const makeResolvers = function (context) {
  return map(FLAG_MAP, (resolverInfo) => {
    return Function.prototype.bind.apply(
      genericResolver, [
        this
      ].concat([
        !!get(
          context,
          get(resolverInfo, 'flag')
        ), get(resolverInfo, 'packagePattern') ||
          get(resolverInfo, 'pattern')
      ])
    );
  });
};

export const resolvePackageDependencies = function (context) {
  return through.obj(function (chunk, enc, cb) {
    let packageJson = JSON.parse(chunk._contents.toString(enc));

    let resolvers = makeResolvers(context);

    let modifiedPackageJson = reduce(
      resolvers,
      (acc, resolver) => resolver(acc),
      packageJson
    );

    // rewrite file contents
    chunk._contents = Buffer.from(JSON.stringify(modifiedPackageJson, null, 2));
    return cb(null, chunk);
  })
};


export default {
  convertPrompts,
  objectsIntersect,
  genericResolver,
  makeResolvers,
  resolvePackageDependencies
};
