/*
        InsecureRestAPI - an insecure NodeJS/Express/MongoDB REST API for educational purposes.

        Copyright (C) 2024-2026  Kevin A. Lee (kadraman)

        This program is free software: you can redistribute it and/or modify
        it under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        This program is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of
        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
        GNU General Public License for more details.

        You should have received a copy of the GNU General Public License
        along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

// Allow optionally using crypto-browserify for legacy/insecure behavior during testing.
let cryptoLib: any;
if (process.env.USE_CRYPTO_BROWSERIFY === 'true') {
    // Use require so bundlers aren't forced to include this in production builds
    // and to allow runtime selection in dev/test scenarios.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cryptoLib = require('crypto-browserify');
} else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    cryptoLib = require('crypto');
}

import Logger from "../middleware/logger";

// Provide an optional legacy shim that emulates the deprecated OpenSSL-style
// `createCipher(algorithm, password)` / `createDecipher(algorithm, password)`
// by deriving a key+iv using the EVP_BytesToKey MD5 scheme. This is insecure
// but useful for intentionally testing detectors that look for legacy crypto use.
// INTENTIONAL - educational: This legacy EVP_BytesToKey implementation is
// included on purpose to demonstrate legacy-crypto detection and should not
// be used in production.
function evpBytesToKey(password: string, keyLen: number, ivLen: number) {
    const passwordBuf = Buffer.from(String(password), 'binary');
    let m = Buffer.alloc(0);
    let i = 0;
    let md5: Buffer = Buffer.alloc(0);
    while (m.length < (keyLen + ivLen)) {
        const hash = cryptoLib.createHash('md5');
        if (i === 0) {
            hash.update(passwordBuf);
        } else {
            hash.update(Buffer.concat([md5, passwordBuf]));
        }
        md5 = hash.digest();
        m = Buffer.concat([m, md5]);
        i++;
    }
    return {
        key: m.slice(0, keyLen),
        iv: m.slice(keyLen, keyLen + ivLen),
    };
}

function createLegacyCipher(algorithm: string, password: string) {
    // Only implemented for AES-*-CTR/GCM/CBC families used in this project.
    // For `aes-256-ctr` key=32 iv=16.
    const keyLen = algorithm.includes('256') ? 32 : 16;
    const ivLen = 16;
    const derived = evpBytesToKey(password, keyLen, ivLen);
    return cryptoLib.createCipheriv(algorithm, derived.key, derived.iv);
}

function createLegacyDecipher(algorithm: string, password: string) {
    const keyLen = algorithm.includes('256') ? 32 : 16;
    const ivLen = 16;
    const derived = evpBytesToKey(password, keyLen, ivLen);
    return cryptoLib.createDecipheriv(algorithm, derived.key, derived.iv);
}

export abstract class EncryptUtils {

    // INTENTIONAL - educational: Default JWT secret present for demo convenience.
    // In real deployments, always set `JWT_SECRET` in the environment and
    // never ship code with a hardcoded secret.
    static jwtSecret = process.env.JWT_SECRET || "your-very-long-and-random-secret-key";
    static jwtExpiration = '1h'; // 1 hour
    static jwtRefreshExpiration = '7d'; // 7 days
    static jwtIssuer = 'InsecureRestAPI';
    static jwtAudience = 'InsecureRestAPIUsers';
    static jwtAlgorithm = 'HS256';
    static encryptionKey = "";
    static algorithm = 'aes-256-ctr';

    public static cryptPassword(password: String): String {
        //process.stdout.write("Encrypting password: " + password);
        const useLegacy = process.env.USE_LEGACY_CIPHER === 'true';
        if (useLegacy) {
            const cipher = createLegacyCipher(this.algorithm, this.encryptionKey);
            let mystr = cipher.update(String(password), 'utf8', 'hex');
            mystr += cipher.final('hex');
            // INTENTIONAL - educational: logging encrypted output (and legacy
            // ciphertext) to stdout for demonstration. Do NOT log secrets in
            // production.
            process.stdout.write(`Encrypted password: ${mystr}\n`);
            return mystr;
        }
        const key = cryptoLib.createHash('sha256').update(String(this.encryptionKey)).digest();
        const iv = cryptoLib.randomBytes(16);
        const cipher = cryptoLib.createCipheriv(this.algorithm, key, iv);
        let mystr = cipher.update(String(password), 'utf8', 'hex');
        mystr += cipher.final('hex');
        const payload = iv.toString('hex') + ':' + mystr;
        // INTENTIONAL - educational: logging IV-prefixed ciphertext to stdout
        // for demo/scanner visibility. Remove logging in real applications.
        process.stdout.write(`Encrypted password: ${payload}\n`);
        return payload;
    }

    public static decryptPassword(hashPassword: String): String {
        // INTENTIONAL - educational: logging cipher text being decrypted.
        process.stdout.write(`Decrypting password: ${hashPassword}\n`);
        const useLegacy = process.env.USE_LEGACY_CIPHER === 'true';
        const parts = String(hashPassword).split(':');
        if (parts.length !== 2) {
            if (useLegacy) {
                // Attempt legacy-style decipher (no IV prefix)
                try {
                    const decipher = createLegacyDecipher(this.algorithm, this.encryptionKey);
                    let mystr = decipher.update(String(hashPassword), 'hex', 'utf8');
                    mystr += decipher.final('utf8');
                    // INTENTIONAL - educational: logging decrypted plaintext.
                    process.stdout.write(`Decrypted password: ${mystr}\n`);
                    return mystr;
                } catch (e) {
                    return String(hashPassword);
                }
            }
            // Not in iv:encrypted format - return as-is or throw
            return String(hashPassword);
        }
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const key = cryptoLib.createHash('sha256').update(String(this.encryptionKey)).digest();
        const decipher = cryptoLib.createDecipheriv(this.algorithm, key, iv);
        let mystr = decipher.update(encrypted, 'hex', 'utf8');
        mystr += decipher.final('utf8');
        // INTENTIONAL - educational: logging decrypted plaintext for demo.
        process.stdout.write(`Decrypted password: ${mystr}\n`);
        return mystr;
    }

    public static comparePassword(password: String, hashPassword: String): Boolean {
        //process.stdout.write("Encrypted password: " + hashPassword);
        const plain = this.decryptPassword(hashPassword);
        // INTENTIONAL - educational: logging comparison of plaintext values.
        process.stdout.write(`Comparing passwords: ${plain} = ${password}\n`);
        return (String(password) == String(plain));
    }

}
