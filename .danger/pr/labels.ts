// Source: https://github.com/withspectrum/danger-plugin-labels/blob/master/src/index.ts
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL';

declare let danger: DangerDSLType;

interface Rule {
  match: RegExp;
  label: string;
}

type RuleInput = string | Rule;

interface Options {
  rules: RuleInput[];
  validate?: (labels: string[]) => Promise<boolean> | boolean;
}

interface IGitHub {
  issue: {
    body?: string;
    number?: number;
  };
  repository?: {
    name: string;
    owner: {
      login: string;
    };
  };
}

/**
 * Extract checked text from markdown checkbox
 */
const getCheckedBoxes = (text: string): string[] => {
  const CHECKBOXES = /^[\t ]*-[\t ]*\[x\][\t ]*(.+?)$/gim;

  // Full Text => ["- [x] Checked", "- [x] Also Checked"]
  const rawMatches = text.match(CHECKBOXES);
  if (!rawMatches || rawMatches.length === 0) {
    return [];
  }

  // Extract checked text from markdown checkbox
  // "- [x] Checked" => "Checked"
  return rawMatches
    .map((result) => new RegExp(CHECKBOXES.source, 'mi').exec(result))
    .filter(Boolean)
    .map((res) => res && res[1]) as string[];
};

/**
 * Extract checked text from markdown checkbox
 */
const getUncheckedBoxes = (text: string): string[] => {
  const UNCHECKEDBOXES = /^[\t ]*-[\t ]*\[[\t ]*\][\t ]*(.+?)$/gim;

  // Full Text => ["- [ ] Unchecked", "- [  ] Also Unchecked"]
  const rawMatches = text.match(UNCHECKEDBOXES);
  if (!rawMatches || rawMatches.length === 0) {
    return [];
  }

  // Extract unchecked text from markdown checkbox
  // "- [ ] Unchecked" => "Unchecked"
  return rawMatches
    .map((result) => new RegExp(UNCHECKEDBOXES.source, 'mi').exec(result))
    .filter(Boolean)
    .map((res) => res && res[1]) as string[];
};

/**
 * Retrieves body and issue information, from PR and Issues alike
 */
function getIssue() {
  // PR
  if (danger.github.thisPR) {
    const pr = danger.github.thisPR;
    return {
      body: danger.github.pr.body,
      issue: { issue_number: pr.number, repo: pr.repo, owner: pr.owner },
    };
  }
  // Issue
  const gh = danger.github as IGitHub;
  return {
    body: gh.issue.body ?? '',
    issue: {
      issue_number: gh.issue.number ?? 0,
      repo: gh.repository?.name ?? '',
      owner: gh.repository?.owner.login ?? '',
    },
  };
}

/**
 * Internal method to filter string[] using rules[], mapping to labels
 */
function filterCheckboxesByRules(checkboxes: string[], rules: Rule[]) {
  return checkboxes
    .map((label) => {
      const rule = rules.find((r) => r.match.test(label));
      return rule?.label;
    })
    .filter(Boolean) as string[];
}

/**
 * Filter issue body checked labels, extracted from checkboxes, using rules
 */
function getMatchingLabels(body: string, rules: Rule[]) {
  return filterCheckboxesByRules(getCheckedBoxes(body), rules);
}

/**
 * Filter issue body unchecked labels, extracted from checkboxes, using rules
 */
function getUncheckedLabels(body: string, rules: Rule[]) {
  return filterCheckboxesByRules(getUncheckedBoxes(body), rules);
}

/**
 * Create Rules[] from RuleInput[]
 */
function parseRuleInput(rules: RuleInput[]) {
  return rules.map((rule) => {
    if (typeof rule !== 'string') {
      return rule;
    }

    return {
      match: new RegExp(rule, 'i'),
      label: rule,
    };
  }) as Rule[];
}

/**
 * Whether the issue contains wording indicating a work in progress
 */
export function isWIP() {
  const wipRegExp = /(WIP|work in progress)/i;

  const hasLabelWIP = danger.github.issue.labels
    .map(({ name }) => name)
    .some((label) => label.match(wipRegExp));

  if (hasLabelWIP) return true;

  const hasTitleWIP = danger.github.pr.title.match(wipRegExp) !== null;

  if (hasTitleWIP) return true;

  const hasCheckedWIP = getCheckedBoxes(getIssue().body).includes('WIP');

  return hasCheckedWIP;
}

/**
 * Let any user add a certain set of labels to your issues and pull requests
 */
export async function labelsPlugin(options: Options) {
  if (!options || !options.rules) {
    throw new Error(
      '[danger-plugin-labels] Please specify the "rules" option.'
    );
  }

  const { body, issue } = getIssue();

  const rules = parseRuleInput(options.rules);
  const matchingLabels = getMatchingLabels(body, rules);
  const uncheckedLabels = getUncheckedLabels(body, rules);

  if (matchingLabels.length === 0 && uncheckedLabels.length === 0) {
    return;
  }

  if (options.validate && (await options.validate(matchingLabels)) === false) {
    return;
  }

  const existingLabels = danger.github.issue.labels.map(({ name }) => name);
  const replacementLabels = Array.from(
    new Set([
      ...matchingLabels,
      ...existingLabels.filter((label) => !uncheckedLabels.includes(label)),
    ])
  ) as string[];

  await danger.github.api.issues.setLabels({
    ...issue,
    labels: replacementLabels,
  });
}
