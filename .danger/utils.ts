/**
 * Create new object corresponding to (before - after)
 */
export function filterDiffs(before, after) {
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
