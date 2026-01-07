import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock logger to avoid creating real transports during tests
jest.mock('../src/middleware/logger', () => ({ __esModule: true, default: { debug: jest.fn(), error: jest.fn() } }));

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe('EncryptUtils', () => {
  test('cryptPassword + decryptPassword roundtrips', () => {
    jest.isolateModules(() => {
      const { EncryptUtils } = require('../src/utils/encrypt.utils');
      EncryptUtils.encryptionKey = 'unit-test-key';

      const plain = 'mySuperSecret123!';
      const cipher = EncryptUtils.cryptPassword(plain);
      const decrypted = EncryptUtils.decryptPassword(cipher);
      expect(decrypted).toBe(plain);
    });
  });

  test('comparePassword returns true for matching password', () => {
    jest.isolateModules(() => {
      const { EncryptUtils } = require('../src/utils/encrypt.utils');
      EncryptUtils.encryptionKey = 'another-test-key';

      const plain = 'compareMe!';
      const cipher = EncryptUtils.cryptPassword(plain);
      expect(EncryptUtils.comparePassword(plain, cipher)).toBeTruthy();
    });
  });

});
