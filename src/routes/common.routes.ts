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

import config from "config";
import {Request, Response, Router} from 'express';
import {AuthorizationHandler} from "../middleware/authorization.handler";
import { nextTick } from "process";
import path from "path";

const apiVersion: string = config.get('App.apiConfig.version') || "v1";

export const commonRoutes = Router();

// redirect root to api-docs
commonRoutes.get('/', [AuthorizationHandler.permitAll], function (req: Request, res: Response) {
    res.redirect('/api-docs');
});

// serve up OpenApi schema
commonRoutes.get('/docs/openapi.json', [AuthorizationHandler.permitAll], function (req: Request, res: Response) {
    res.sendFile(path.join(global.__basedir, 'public', 'docs', 'openapi.json'));
});

// URL not found
commonRoutes.all('*', [AuthorizationHandler.permitAll], function (req: Request, res: Response) {
    res.status(404).send({error: true, message: 'Please check your URL.'});
});
