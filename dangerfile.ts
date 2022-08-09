import { danger, message, warn } from 'danger';
import yarn from 'danger-plugin-yarn';

import {
  doesDescriptionExists,
  doesPRtargetMain,
  enforceLinearHistory,
  isDescriptionCorrectlyFormatted,
  isPRTooBig,
  yarnAuditCI,
} from './.danger';

const docs = danger.git.fileMatch('**/*.md');
const app = danger.git.fileMatch('(apps|packages)/**/*.ts*');
const tests = danger.git.fileMatch('**/(*.)+(spec|test).ts');

if (docs.edited) {
  message(
    'Thanks - We :heart: our [documentarians](http://www.writethedocs.org/)!'
  );
}

if (app.modified && !tests.modified) {
  const message =
    'There are app changes, but not tests.' +
    "That's OK as long as you're refactoring existing code";
  warn(message);
}

yarn();

yarnAuditCI();

enforceLinearHistory();

if (danger.github?.pr) {
  isPRTooBig(600);

  doesDescriptionExists();
  isDescriptionCorrectlyFormatted();

  doesPRtargetMain();
}
