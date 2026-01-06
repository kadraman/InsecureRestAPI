import { jest, describe, test, expect } from '@jest/globals';

const { TextUtils } = require('../src/utils/text.utils');

describe('TextUtils.stripAnsiCodes', () => {
  test('removes simple SGR color codes', () => {
    const input = '\u001b[31mred\u001b[0m';
    const out = TextUtils.stripAnsiCodes(input);
    expect(out).toBe('red');
  });

  test('preserves plain text without codes', () => {
    const input = 'plain text 123!';
    expect(TextUtils.stripAnsiCodes(input)).toBe(input);
  });

  test('removes multiple and nested codes', () => {
    const input = '\u001b[1m\u001b[32mGreen Bold\u001b[0m Normal';
    const out = TextUtils.stripAnsiCodes(input);
    expect(out).toBe('Green Bold Normal');
  });

  test('handles empty string', () => {
    expect(TextUtils.stripAnsiCodes('')).toBe('');
  });
});
