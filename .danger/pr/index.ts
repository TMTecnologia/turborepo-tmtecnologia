import { DangerDSLType } from '../../node_modules/danger/distribution/dsl/DangerDSL';

declare const danger: DangerDSLType;
declare function warn(message: string): void;
declare function fail(message: string): void;

export * from './description';

/**
 * Fails if the PR targets anything other than `main` or `-stable`.
 */
export function doesPRtargetMain() {
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

/**
 * Warns if PR is bigger than threshold
 * @argument bigPRThreshold the expected PR size
 */
export function isPRTooBig(bigPRThreshold: number) {
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
}
