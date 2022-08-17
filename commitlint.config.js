/*!
 * Original code by Patrick Fu
 * Copyright (c) 2021 Patrick Fu, see LICENSE.md for details
 *
 * Credits to the Gitmoji Commitlint Guide author:
 * https://github.com/patrick-fu/gitmoji_commitlint_guide
 */

/*!
 * Original code by Carlos Cuesta
 * MIT Licensed, Copyright (c) 2016-2022 Carlos Cuesta, see LICENSE.md for details
 *
 * Credits to the Gitmoji team:
 * https://github.com/carloscuesta/gitmoji/blob/master/src/data/gitmojis.json
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gitmojis = require('./gitmojis.json');

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      // We change the parser regex pattern to match emoji UTF-8 character
      // The "[\u23ea-\ufe0f]{1,2}" means that some emojis are in two bytes but not one
      // So this pattern matches string like "🐛 Fix a bug"
      headerPattern: /^([\u23ea-\ufe0f]{1,2})(?:\(([\w$.\-* ]*)\))? (.*)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', gitmojis],
    'type-case': [0, 'always', 'lower-case'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0, 'always', 'sentence-case'],
    'header-min-length': [2, 'always', 15],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
    'type-empty': [0],
    'subject-empty': [0],
  },
};
