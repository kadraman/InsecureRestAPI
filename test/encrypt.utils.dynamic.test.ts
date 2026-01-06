import { expect, test, describe, beforeEach, afterEach } from '@jest/globals';

// These tests load `EncryptUtils` dynamically under different environment
// settings so the module picks the right crypto backend at import time.

describe('EncryptUtils dynamic import (modern vs legacy)', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules(); // clear module cache
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  test('modern mode: returns iv-prefixed ciphertext and round-trips', () => {
    process.env.USE_CRYPTO_BROWSERIFY = 'false';
    process.env.USE_LEGACY_CIPHER = 'false';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { EncryptUtils } = require('../src/utils/encrypt.utils');

    const plain = 'modern-password-1';
    const enc = EncryptUtils.cryptPassword(plain);
    expect(typeof enc).toBe('string');
    // Expect iv:hex format
    expect(enc).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
    const dec = EncryptUtils.decryptPassword(enc);
    expect(dec).toBe(plain);
    expect(EncryptUtils.comparePassword(plain, enc)).toBeTruthy();
    expect(EncryptUtils.comparePassword('wrong', enc)).toBeFalsy();
  });

  test('legacy mode: deterministic, no IV prefix, round-trips', () => {
    process.env.USE_CRYPTO_BROWSERIFY = 'true';
    process.env.USE_LEGACY_CIPHER = 'true';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { EncryptUtils } = require('../src/utils/encrypt.utils');

    const plain = 'ABCDE12345';
    const enc = EncryptUtils.cryptPassword(plain);
    // Legacy mode should not include an IV prefix
    expect(enc).not.toMatch(/:/);
    const dec = EncryptUtils.decryptPassword(enc);
    expect(dec).toBe(plain);
    expect(EncryptUtils.comparePassword(plain, enc)).toBeTruthy();
  });

  test('modern mode: decrypting legacy literal returns input unchanged', () => {
    process.env.USE_CRYPTO_BROWSERIFY = 'false';
    process.env.USE_LEGACY_CIPHER = 'false';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { EncryptUtils } = require('../src/utils/encrypt.utils');

    const legacyLiteral = 'acbf8a291bed749b6eeb';
    const dec = EncryptUtils.decryptPassword(legacyLiteral);
    // In modern mode we do not attempt legacy decryption, so it should return the input
    expect(dec).toBe(legacyLiteral);
  });
});
