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
// eslint-disable-next-line @typescript-eslint/no-var-requires
const types = require('./types.json');

/** @type {import('cz-git').UserConfig} */
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
    'subject-min-length': [2, 'always', 15],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 200],
    'type-empty': [0],
    'subject-empty': [0],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    formatMessageCB: ({ emoji, scope, subject }) => {
      return scope ? `${emoji} (${scope}): ${subject}` : `${emoji} ${subject}`;
    },
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking:
        'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect:
        'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefixs: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
    types,
    useEmoji: true,
    emojiAlign: 'center',
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    markBreakingChangeMode: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [
      { value: 'closed', name: 'closed:   ISSUES has been processed' },
    ],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: 'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
};
