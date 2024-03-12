/**
 * Solution inspired by https://stackoverflow.com/a/10232792 and regex from
 * https://stackoverflow.com/a/24419159. Thanks!!
 */

export default function isURLSafe(str: string): boolean {
  return str !== null && str.match("^[a-zA-Z0-9_-]*$") !== null;
}
