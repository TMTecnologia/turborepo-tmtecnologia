import { danger, message, schedule } from 'danger';
import * as reporter from 'danger-plugin-lint-report';
import todos from 'danger-plugin-todos';
import yarn from 'danger-plugin-yarn';

import {
  createOrAddLabelsFromPRTitle,
  doesDescriptionExists,
  doesPRtargetMain,
  enforceLinearHistory,
  isDescriptionCorrectlyFormatted,
  isPRTooBig,
  yarnAuditCI,
} from './.danger';

const docs = danger.git.fileMatch('**/*.md');

if (docs.edited) {
  message(
    'Thanks - We :heart: our [documentarians](http://www.writethedocs.org/)!'
  );
}

yarn();

yarnAuditCI();

enforceLinearHistory();

if (danger.github?.pr) {
  isPRTooBig(600);

  doesDescriptionExists();
  isDescriptionCorrectlyFormatted();

  doesPRtargetMain();

  // extracting labels from inside brackets
  createOrAddLabelsFromPRTitle(/(?<=\[)(.*?)(?=\])/g);

  schedule(
    reporter.scan({
      fileMask: '**/lint-results.xml',
      reportSeverity: true,
      requireLineModification: true,
    })
  );

  schedule(
    todos({
      repoUrl: 'https://github.com/Quenom117/teste',
    })
  );
}
