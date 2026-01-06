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

import { NextFunction, Request, Response } from "express";
import {forbidden, unauthorised, internalError} from "../modules/common/service";

import Logger from "./logger";
import { TextUtils } from "../utils/text.utils";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err.name === 'UnauthorizedError') {
        Logger.error(err);
        unauthorised(TextUtils.stripAnsiCodes(err.message), res);
        return;
    } else if (err.name ==='InsufficientScopeError') {
        Logger.error(err);
        forbidden(TextUtils.stripAnsiCodes(err.message), res);
    } else {
        Logger.info("How do i get here");
        internalError(TextUtils.stripAnsiCodes(err.message), res);
    }  
    next();
};

export default errorHandler;