/**
 * Given a string, hash it into some positive integer value with a max size.
 *
 * @param str The string to hash into an integer
 * @param length The maximum value (exclusive) that the result can be.
 * @returns A positive integer from 0 (inclusive) to length (exclusive) hashed from the input
 *   string.
 */
export default function hashString(str: string, length: number): number {
  let hashValue = 0;
  if (str.length === 0) return hashValue;

  for (let x = 0; x < str.length; x++) {
    const ch = str.charCodeAt(x);
    hashValue = (hashValue << 5) - hashValue + ch;
    hashValue &= hashValue;
  }
  return Math.floor(Math.abs(hashValue) % length);
}
