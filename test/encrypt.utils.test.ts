import {expect, jest, test, describe} from '@jest/globals';
import { EncryptUtils } from "../src/utils/encrypt.utils";

describe("Encryption TestCases", () => {

    test("Encrypt/Decrypt roundtrip", () => {
        const plain = "ABCDE12345";
        const enc = EncryptUtils.cryptPassword(plain);
        const dec = EncryptUtils.decryptPassword(enc);
        expect(dec).toBe(plain);

        // In legacy mode the ciphertext is deterministic and matches the old value
        if (process.env.USE_LEGACY_CIPHER === 'true' && process.env.USE_CRYPTO_BROWSERIFY === 'true') {
            expect(enc).toBe("acbf8a291bed749b6eeb");
        } else {
            // Modern mode: expect iv:hex format
            expect(typeof enc).toBe('string');
            expect(enc).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);
        }
    });

    test("Decrypt legacy literal", () => {
        if (process.env.USE_LEGACY_CIPHER === 'true' && process.env.USE_CRYPTO_BROWSERIFY === 'true') {
            const dec = EncryptUtils.decryptPassword("acbf8a291bed749b6eeb");
            expect(dec).toBe("ABCDE12345");
        } else {
            // In modern mode, attempting to decrypt a legacy literal returns it unchanged
            const dec = EncryptUtils.decryptPassword("acbf8a291bed749b6eeb");
            expect(dec).toBe("acbf8a291bed749b6eeb");
        }
    });

    test("Compare passwords", () => {
        const enc = EncryptUtils.cryptPassword("ABCDE12345");
        expect(EncryptUtils.comparePassword("ABCDE12345", enc)).toBeTruthy();
        expect(EncryptUtils.comparePassword("12345ABCDE", enc)).toBeFalsy();
    });

});