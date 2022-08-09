import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL';

declare const danger: DangerDSLType;
declare function fail(message: string): void;

/**
 * Fail if PR includes merge commits
 */
export function enforceLinearHistory() {
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
