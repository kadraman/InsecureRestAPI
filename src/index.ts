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

import config from 'config';

import app from "./configs/app.config";
import Logger from "./middleware/logger";
import fs from "fs";
import http from "http";
import dbConfig from './configs/db.config';
import path from "path";

global.__basedir = __dirname;
if (fs.existsSync('./src')) { // src only exists in development
    global.__basedir = path.resolve(global.__basedir, '..')
}

const appName: string = config.has('App.name') ? config.get('App.name') : "InsecureRestAPI";
const appUrl: string = config.has('App.apiConfig.url') ? config.get('App.apiConfig.url') : "http://localhost:5000/api-docs/";
const appEnv: string = process.env.NODE_ENV || 'development';
const appPort: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

(async () => {
    //await dbConfig.init();
    await dbConfig.connect(true);
    //await dbConfig.populate();

    http.createServer(app).listen(appPort, () => {
        Logger.debug(`Running in directory: ${global.__basedir}`);
        Logger.info(`${appName} is online at ${appUrl} in ${appEnv} mode.`);
    });
})();

