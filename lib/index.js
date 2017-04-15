'use strict';

const _ = require('lodash');

module.exports = {
  convertPrompts: function(PROMPTS) {
    return _.map(PROMPTS, function (promptValue, promptKey) {
      return _.merge(
        promptValue, {
          name: promptKey
        }
      );
    });
  }
};
