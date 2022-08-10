/**
 * Create new object corresponding to (before - after)
 */
export function filterDiffs<T>(
  before,
  after,
  callback: (beforeKey, afterKey) => T = (_, afterKey) => afterKey
) {
  // Source: https://stackoverflow.com/questions/8431651/getting-a-diff-of-two-json-objects#answer-8432188
  const result = {};
  let key;
  for (key in before) {
    if (after[key] != before[key])
      result[key] = callback(before[key], after[key]);
    if (typeof after[key] == 'object' && typeof before[key] == 'object')
      result[key] = filterDiffs(before[key], after[key]);
  }
  return result;
}
