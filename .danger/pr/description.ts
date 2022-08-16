import { DangerDSLType } from '../../node_modules/danger/distribution/dsl/DangerDSL';

declare const danger: DangerDSLType;
declare function message(message: string): void;
declare function fail(message: string): void;

/**
 * Fails if PR does not have, or too short, description
 */
export function doesDescriptionExists(): void {
  // Provides advice if body is too short or non-existent
  if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
    const title = ':grey_question: Missing Description';
    const idea =
      'The description seems short, ' +
      'could you tell us a little more about your changes?';
    fail(`${title} - <i>${idea}</i>`);
  }
}

/**
 * Messages if PR is missing important description sessions
 *
 * expects summary and test plan
 */
export function isDescriptionCorrectlyFormatted(): void {
  // Provides advice if a summary section is missing
  const includesSummary = danger.github.pr.body
    .toLowerCase()
    .includes('## resumo');

  if (!includesSummary) {
    const title = ':clipboard: Missing Summary';
    const idea =
      'Can you add a Summary? ' +
      'To do so, add a "## Resumo" section to your PR description. ' +
      'This is a good place to explain the motivation for making this change.' +
      'Also a good place to link to related issues resolved by this change, ' +
      'read more @ [GitHub docs](https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword)';
    message(`${title} - <i>${idea}</i>`);
  }

  // Provides advice if a test plan is missing.
  const includesTestPlan = danger.github.pr.body
    .toLowerCase()
    .includes('## plano de teste');

  if (!includesTestPlan) {
    const title = ':clipboard: Missing Test Plan';
    const idea =
      'Can you add a Test Plan? ' +
      'To do so, add a "## Plano de Teste" section to your PR description. ' +
      'A Test Plan lets us know how these changes were tested.';
    message(`${title} - <i>${idea}</i>`);
  }
}
