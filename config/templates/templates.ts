'use strict';

import { getEnvContextFromAnswers } from '../../lib/env/context';
import { getSourceTemplatePatterns } from '../../lib/env/flags';
import { FLAG_MAP } from './flagMap';

export default function (answers) {
  const ENV_CONTEXT = getEnvContextFromAnswers(answers);
  const SOURCE_TEMPLATES_PATTERNS = getSourceTemplatePatterns(ENV_CONTEXT);

  return {
    ENV_CONTEXT,
    ...ENV_CONTEXT,

    SOURCE_TEMPLATES_PATTERNS,
    FLAG_MAP,
  };
};
