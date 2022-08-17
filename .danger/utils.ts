/**
 * Create new object corresponding to (before - after)
 */
export function filterDiffs<T>(
  before,
  after,
  callback: (beforeKey, afterKey) => T = (_, afterKey) => afterKey
) {
  /*!
   * Original code by Gabriel Reitz Giannattasio from StackOverflow
   *
   * Attribution-ShareAlike 4.0 International Licensed, Copyright (c) 2019 Gabriel Reitz Giannattasio, see https://creativecommons.org/licenses/by-sa/4.0/ for details
   *
   * Credits to the Gabriel Gartz team:
   * https://stackoverflow.com/questions/8431651/getting-a-diff-of-two-json-objects#answer-8432188
   * https://stackoverflow.com/users/583049/gabriel-gartz
   */
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
