'use strict';

const _ = require('lodash');

const convertPrompts = function(PROMPTS) {
  return _.map(PROMPTS, function (promptValue, promptKey) {
    return _.merge(
      promptValue, {
        name: promptKey
      }
    );
  });
};

const findPromptPropSplitIndex = function (PROMPTS, prop, propValue, offset=0) {
  let cutOffIndex = _.findIndex(PROMPTS, [prop, propValue]);

  if (cutOffIndex === -1) return PROMPTS;

  let numPrompts = PROMPTS.length;
  if (Math.abs(offset) > 0) {
    let cutOffIndexWithOffset = cutOffIndex + offset;

    cutOffIndex = cutOffIndexWithOffset;

    if (cutOffIndexWithOffset > numPrompts) cutOffIndex = numPrompts;
    else if (cutOffIndexWithOffset < 0) cutOffIndex = 0;
  }

  return cutOffIndex;
};

const findPromptNameSplitIndex = function (PROMPTS, name, offset=0) {
  return findPromptPropSplitIndex(PROMPTS, 'name', name, offset);
};

const getPromptsUpToName = function (PROMPTS, name) {
  let cutOffIndex = findPromptNameSplitIndex(PROMPTS, name, 0);
  return _.take(PROMPTS, cutOffIndex);
};

const getPromptsUpToProp = function (PROMPTS, propName, propValue) {
  let cutOffIndex = findPromptPropSplitIndex(PROMPTS, propName, propValue, 0);
  return _.take(PROMPTS, cutOffIndex);
};

const getPromptsAfterName = function (PROMPTS, name) {
  let cutOffIndex = findPromptNameSplitIndex(PROMPTS, name, 1);
  return _.takeRight(PROMPTS, PROMPTS.length - cutOffIndex);
};

const getPromptsAfterProp = function (PROMPTS, propName, propValue) {
  let cutOffIndex = findPromptPropSplitIndex(PROMPTS, propName, propValue, 1);
  return _.takeRight(PROMPTS, PROMPTS.length - cutOffIndex);
};

const splitPromptsAtName = function (PROMPTS, name) {
  return [
    getPromptsUpToName(PROMPTS, name),
    getPromptsAfterName(PROMPTS, name)
  ]
};

const splitPromptsAtProp = function (PROMPTS, propName, propValue) {
  return [
    getPromptsAfterProp(PROMPTS, propName, propValue),
    getPromptsUpToProp(PROMPTS, propName, propValue)
  ]
};

module.exports = {
  convertPrompts,
  findPromptPropSplitIndex,
  splitPromptsAtName,
  splitPromptsAtProp,
  getPromptsUpToName,
  getPromptsUpToProp,
  getPromptsAfterName,
  getPromptsAfterProp
};
