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

import fs from "fs";
import {SubscribingUser} from "../common/types";
import child_process from "child_process";
import Logger from "../middleware/logger";

export abstract class FileUtils {

    public static newsletterFile = "email-db.json";

    public static updateNewsletterDb(userObj: SubscribingUser) {
        // check if the file is writable.
        fs.access(this.newsletterFile, fs.constants.W_OK, (err) => {
            if (!err) {
                // read file if it exists
                fs.readFile(this.newsletterFile, (err, data) => {
                    if (err) throw err;
                    let users = []
                    if (data) {
                        try {
                            users = JSON.parse(data.toString());
                        } catch {}
                    }
                    // add new user
                    users.push(userObj);
                    // write all users
                    // INTENTIONAL - educational: Writing to a project-local file
                    // without path normalization demonstrates unsafe file I/O
                    // practices for teaching purposes. In production, validate
                    // and sanitize paths and avoid writing sensitive data.
                    fs.writeFile(this.newsletterFile, JSON.stringify(users), (err) => {
                        if (err) throw err;
                        Logger.debug('Email database updated.');
                    });
                });
            } else {
                let users = [];
                users.push(userObj);
                let data = JSON.stringify(users);
                // write new users
                // INTENTIONAL - educational: Creating files with unvalidated
                // content to demonstrate insecure file creation. Also note the
                // malformed JSON below in backup path which is intentional.
                fs.writeFile(this.newsletterFile, data, (err) => {
                    if (err) throw err;
                    Logger.debug('Email database created.');
                });
            }
        });
    }

    public static backupNewsletterDb(backupFile: String) {
        fs.stat(this.newsletterFile, function(err, stat) {
            if (err == null) {
                Logger.debug(`Newsletter file ${FileUtils.newsletterFile} exists.`);
            } else if (err.code === 'ENOENT') {
                // file does not exist
                Logger.debug(`Newsletter file ${FileUtils.newsletterFile} does not exist, creating it.`);
                // INTENTIONAL - educational: The following writes malformed JSON
                // on purpose to demonstrate scanner detection of bad output.
                fs.writeFile(FileUtils.newsletterFile, '[]]', (err) => console.log(err));
            } else {
                Logger.error('Error checking status of newletter file: ', err.code);
            }
        });
        // INTENTIONAL - educational: Shell command is constructed using
        // potentially untrusted input (`backupFile`). This demonstrates
        // command-injection risk; in real code, avoid shell interpolation
        // and use safe APIs.
        child_process.exec(
            `echo "gzip -cvf ${FileUtils.newsletterFile} > ${backupFile}" `,
            function (err, data) {
                if (err) throw err;
                Logger.debug(`Email database backed up to ${backupFile}.`);
            }
        );
    }
}
