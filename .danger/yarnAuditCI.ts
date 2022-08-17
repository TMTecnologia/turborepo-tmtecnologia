import * as fs from 'fs';

import { filterDiffs } from './utils';

declare function message(message: string): void;
declare function warn(message: string): void;

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

/**
 * Formats audit-ci json reports to string
 */
function prettyPrintAuditReport(report: IAuditReport): string {
  /*!
   * Original code by Revath S Kumar
   * MIT Licensed, Copyright (c) 2019 Revath S Kumar, see LICENSE.md for details
   *
   * Credits to the Danger Plugin NPM Audit team:
   * https://github.com/revathskumar/danger-plugin-npm-audit/blob/master/index.js
   */
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

/**
 * Compare and report new vulnerabilities added in PR,
 *
 * reads inputs from .diff/audit-ci/{before,after}.json
 */
export function yarnAuditCI(): void {
  let before: IAuditReport;
  let after: IAuditReport;

  try {
    before = JSON.parse(
      fs.readFileSync(`${__dirname}/../.diff/audit-ci/before.json`, 'utf8')
    ) as IAuditReport;
    after = JSON.parse(
      fs.readFileSync(`${__dirname}/../.diff/audit-ci/after.json`, 'utf8')
    ) as IAuditReport;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('yarnAuditCI: error parsing files, skipping rule');
    // eslint-disable-next-line no-console
    console.log(error);
    return;
  }

  const diffs = filterDiffs<number>(
    before,
    after,
    (beforeKey, afterKey) => afterKey - beforeKey
  ) as IAuditReport;
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
