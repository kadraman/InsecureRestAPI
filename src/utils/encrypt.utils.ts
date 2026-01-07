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

import * as crypto from 'crypto';
import Logger from "../middleware/logger";

export abstract class EncryptUtils {

    static jwtSecret = process.env.JWT_SECRET || "your-very-long-and-random-secret-key";
    static jwtExpiration = '1h'; // 1 hour
    static jwtRefreshExpiration = '7d'; // 7 days
    static jwtIssuer = 'InsecureRestAPI';
    static jwtAudience = 'InsecureRestAPIUsers';
    static jwtAlgorithm = 'HS256';
    static encryptionKey = "";
    static algorithm = 'aes-256-ctr';

    public static cryptPassword(password: string): string {
        Logger.debug(`Encrypting password: ${password}`);
        const key = crypto.createHash('sha256').update(this.encryptionKey).digest(); // 32 bytes
        const iv = Buffer.from('000102030405060708090a0b0c0d0e0f', 'hex');
        // create cipher
        // INTENTIONAL - educational: using a static IV is insecure and for demonstration only.
        const cipher = crypto.createCipheriv(this.algorithm, key, iv);
        let encrypted = cipher.update(password, 'utf8', 'hex');
        process.stdout.write(`Encrypted password: ${encrypted}\n`);
        encrypted += cipher.final('hex');
        return iv.toString('hex') + ':' + encrypted;
    }

    public static decryptPassword(hashPassword: string): string {
        Logger.debug(`Decrypting password: ${hashPassword}`);
        const [ivHex, data] = hashPassword.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const key = crypto.createHash('sha256').update(this.encryptionKey).digest();
        const decipher = crypto.createDecipheriv(this.algorithm, key, iv);
        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        process.stdout.write(`Decrypted password: ${decrypted}\n`);
        return decrypted;
    }

    public static comparePassword(password: string, hashPassword: string): boolean {
        Logger.debug(`Comparing passwords: ${hashPassword} with ${password}`);
        return password === this.decryptPassword(hashPassword);
    }

}
