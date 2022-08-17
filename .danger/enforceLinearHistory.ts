import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL';

declare const danger: DangerDSLType;
declare function fail(message: string): void;

/**
 * Fail if PR includes merge commits
 */
export function enforceLinearHistory() {
  /*!
   * Original code by Sourav Sarkar
   * MIT Licensed, Copyright (c) 2021 Sourav Sarkar, see LICENSE.md for details
   *
   * Credits to the Danger Plugin Linear History team:
   * https://github.com/amsourav/danger-plugin-linear-history/blob/master/src/index.ts
   */
  const hasMergeCommit = danger.git.commits.some(
    (commit) => (commit.parents?.length ?? 0) > 1
  );

  if (hasMergeCommit) {
    const title = ':twisted_rightwards_arrows: Merge Commit';
    const idea =
      'To help keep a linear history in `main` branch, ' +
      'please rebase to remove merge commits';
    fail(`${title} - <i>${idea}</i>`);
  }
}
