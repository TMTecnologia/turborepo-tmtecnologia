import { danger, fail, message, warn } from 'danger';
import yarn from 'danger-plugin-yarn';
import * as fs from 'fs';

const docs = danger.git.fileMatch('**/*.md');
const app = danger.git.fileMatch('(apps|packages)/**/*.ts*');
const tests = danger.git.fileMatch('**/(*.)+(spec|test).ts');

if (docs.edited) {
  message(
    'Thanks - We :heart: our [documentarians](http://www.writethedocs.org/)!'
  );
}

if (app.modified && !tests.modified) {
  warn(
    'There are app changes, but not tests.' +
      "That's OK as long as you're refactoring existing code"
  );
}

yarn();

interface IAuditReport {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  dependencies: number;
  devDependencies: number;
  optionalDependencies: number;
  totalDependencies: number;
}

function filterDiffs(before, after) {
  // Source: https://stackoverflow.com/questions/8431651/getting-a-diff-of-two-json-objects#answer-8432188
  const result = {};
  let key;
  for (key in before) {
    if (after[key] != before[key]) result[key] = after[key] - before[key];
    if (typeof after[key] == 'object' && typeof before[key] == 'object')
      result[key] = filterDiffs(before[key], after[key]);
  }
  return result;
}

function prettyPrintAuditReport(report: IAuditReport) {
  // Source: https://github.com/revathskumar/danger-plugin-npm-audit
  const { vulnerabilities, totalDependencies } = report;
  const totalVulnerabilities = Object.values(vulnerabilities)
    .filter((level) => level > 0)
    .reduce((total, level) => total + level, 0);
  const summary = Object.keys(vulnerabilities)
    .map((level) => ({ level, count: vulnerabilities[level] }))
    .filter((levelCount) => levelCount.count > 0)
    .map((levelCount) => `${levelCount.count} ${levelCount.level}`)
    .join(', ');

  const title =
    `found ${totalVulnerabilities} vulnerabilities (${summary}) ` +
    `in ${totalDependencies} scanned packages`;
  return `${title}`;
}

function yarnAuditCI() {
  let before: IAuditReport;
  let after: IAuditReport;

  try {
    before = JSON.parse(
      fs.readFileSync(`${__dirname}/.diff/audit-ci/before.json`, 'utf8')
    ) as IAuditReport;
    after = JSON.parse(
      fs.readFileSync(`${__dirname}/.diff/audit-ci/after.json`, 'utf8')
    ) as IAuditReport;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('yarnAuditCI: error parsing files, skipping rule');
    return;
  }

  const diffs = filterDiffs(before, after) as IAuditReport;
  message(JSON.stringify(diffs));
  const saferRepo = Object.values(diffs.vulnerabilities).every(
    (level) => level <= 0
  );

  if (saferRepo) {
    message(':lock: Thanks for improving our codebase security');
    return;
  }
  warn(
    prettyPrintAuditReport(
      Object.assign(diffs, {
        totalDependencies: diffs.totalDependencies ?? after.totalDependencies,
      })
    )
  );
}

yarnAuditCI();

function enforceLinearHistory() {
  // Source: https://github.com/amsourav/danger-plugin-linear-history/blob/master/src/index.ts
  const hasMergeCommit = danger.git.commits.some(
    (commit) => commit.parents?.length > 1
  );

  if (hasMergeCommit) {
    const title = ':twisted_rightwards_arrows: Merge Commit';
    const idea =
      'To help keep a linear history in `main` branch, ' +
      'please rebase to remove merge commits';
    fail(`${title} - <i>${idea}</i>`);
  }
}

enforceLinearHistory();

function doesDescriptionExists() {
  // Provides advice if body is too short or non-existent
  if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
    const title = ':grey_question: Missing Description';
    const idea =
      'The description seems short, ' +
      'could you tell us a little more about your changes?';
    fail(`${title} - <i>${idea}</i>`);
  }
}

function isDescriptionCorrectlyFormatted() {
  // Provides advice if a summary section is missing
  const includesSummary = danger.github.pr.body
    .toLowerCase()
    .includes('## summary');

  if (!includesSummary) {
    const title = ':clipboard: Missing Summary';
    const idea =
      'Can you add a Summary? ' +
      'To do so, add a "## Summary" section to your PR description. ' +
      'This is a good place to explain the motivation for making this change.' +
      'Also a good place to link to related issues resolved by this change, ' +
      'read more @ [GitHub docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)';
    message(`${title} - <i>${idea}</i>`);
  }

  // Provides advice if a test plan is missing.
  const includesTestPlan = danger.github.pr.body
    .toLowerCase()
    .includes('## test plan');

  if (!includesTestPlan) {
    const title = ':clipboard: Missing Test Plan';
    const idea =
      'Can you add a Test Plan? ' +
      'To do so, add a "## Test Plan" section to your PR description. ' +
      'A Test Plan lets us know how these changes were tested.';
    message(`${title} - <i>${idea}</i>`);
  }
}

if (danger.github?.pr) {
  const bigPRThreshold = 600;

  if (
    danger.github.pr.additions + danger.github.pr.deletions >
    bigPRThreshold
  ) {
    const title = ':exclamation: Big PR';
    const idea =
      'Pull Request size seems relatively large. ' +
      'If Pull Request contains multiple changes, ' +
      'split each into separate PR will help faster, easier review.';
    warn(`${title} - <i>${idea}</i>`);
  }

  doesDescriptionExists();
  isDescriptionCorrectlyFormatted();

  // Fails if the PR targets anything other than `main` or `-stable`.
  const isMergeRefMain = danger.github.pr.base.ref === 'main';
  const isMergeRefStable = danger.github.pr.base.ref.indexOf('-stable') !== -1;
  if (!isMergeRefMain && !isMergeRefStable) {
    const title = ':exclamation: Base Branch';
    const idea =
      'The base branch for this PR is something ' +
      'other than `main` or a `-stable` branch';
    fail(`${title} - <i>${idea}</i>`);
  }
}
