'use strict';

const {
  map,
  merge,
  take,
  takeRight,
  findIndex,
} = require('lodash');

export const convertPrompts = (PROMPTS) => map(PROMPTS, function (promptValue, promptKey) {
  return merge(
    promptValue, {
      name: promptKey
    }
  );
});

export const findPromptPropSplitIndex = function (PROMPTS, prop, propValue, offset=0) {
  let cutOffIndex = findIndex(PROMPTS, [prop, propValue]);

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

export const findPromptNameSplitIndex = (PROMPTS, name, offset=0) =>
  findPromptPropSplitIndex(PROMPTS, 'name', name, offset)

export const getPromptsUpToName = function (PROMPTS, name) {
  let cutOffIndex = findPromptNameSplitIndex(PROMPTS, name, 0);
  return take(PROMPTS, cutOffIndex);
};

export const getPromptsUpToProp = function (PROMPTS, propName, propValue) {
  let cutOffIndex = findPromptPropSplitIndex(PROMPTS, propName, propValue, 0);
  return take(PROMPTS, cutOffIndex);
};

export const getPromptsAfterName = function (PROMPTS, name) {
  let cutOffIndex = findPromptNameSplitIndex(PROMPTS, name, 1);
  return takeRight(PROMPTS, PROMPTS.length - cutOffIndex);
};

export const getPromptsAfterProp = function (PROMPTS, propName, propValue) {
  let cutOffIndex = findPromptPropSplitIndex(PROMPTS, propName, propValue, 1);
  return takeRight(PROMPTS, PROMPTS.length - cutOffIndex);
};

export const splitPromptsAtName = (PROMPTS, name) => [
  getPromptsUpToName(PROMPTS, name),
  getPromptsAfterName(PROMPTS, name)
];

export const splitPromptsAtProp = (PROMPTS, propName, propValue) => [
  getPromptsAfterProp(PROMPTS, propName, propValue),
  getPromptsUpToProp(PROMPTS, propName, propValue)
];

export default {
  convertPrompts,
  findPromptPropSplitIndex,
  splitPromptsAtName,
  splitPromptsAtProp,
  getPromptsUpToName,
  getPromptsUpToProp,
  getPromptsAfterName,
  getPromptsAfterProp
};
