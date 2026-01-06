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

import Logger from "./logger";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import moment from "moment";

import { IUser } from "../modules/users/model";
import { forbidden, unauthorised } from "../modules/common/service";
import { JwtJson, Permission } from "../common/types";
import { EncryptUtils } from "../utils/encrypt.utils";
import { UserPermission } from "../modules/users/permissions";
import { ProductPermission } from "../modules/products/permissions";
import { MessagePermission } from "../modules/messages/permissions";


export class AuthenticationHandler {

    public static createJWT(user_data: IUser): JwtJson {
        // INTENTIONAL - educational: Logging secrets/tokens for demo purposes.
        // In production do not log secrets or tokens.
        console.log(`Creating JWT authentication token using secret: ${EncryptUtils.jwtSecret}`);
        var permissions = this.getUserPermissions(user_data);
        const accessToken = jwt.sign({ id: user_data._id, permissions: permissions, email: user_data.email }, EncryptUtils.jwtSecret, {
            expiresIn: EncryptUtils.jwtExpiration,
        })
        const refreshToken = jwt.sign({ id: user_data._id, permissions: permissions, email: user_data.email }, EncryptUtils.jwtSecret, {
            expiresIn: EncryptUtils.jwtRefreshExpiration,
        })
        // INTENTIONAL - educational: Logging created tokens for scanner visibility.
        console.log(`Created accessToken: ${accessToken}`);
        console.log(`Created refreshToken: ${refreshToken}`);
        return {
            id: user_data._id,
            email: user_data.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenExpiration: moment.duration(EncryptUtils.jwtExpiration).asSeconds(),
            tokenType: 'Bearer'
        }
    }

    public static verifyJWT(req: Request, res: Response, next: NextFunction) {
        // INTENTIONAL - educational: Logging verification details (including
        // the secret) for demonstration. Do not log secrets in production.
        console.log(`Verifying JWT authentication token using secret ${EncryptUtils.jwtSecret}`);
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            // INTENTIONAL - educational: Logging tokens being verified for demo.
            console.log(`JWT authentication token is: ${token}`);
            jwt.verify(token, EncryptUtils.jwtSecret, (err: any, data: any) => {
                if (err) {
                    Logger.error(err);
                    forbidden(`The JWT authentication token has expired`, res);
                }
                if (req.session) {
                    req.session.userId = (<any>data).id;
                    req.session.email = (<any>data).email;
                }
                next();
            });
        } else {
            unauthorised("Missing or invalid authentication token", res);
        }
    }

    private static getUserPermissions(user_data: IUser): Permission[] {
        if (user_data && user_data.is_admin) {
            Logger.debug(`User ${user_data.email} is an admin, granting all permissions.`);
            return [
                UserPermission.Create, UserPermission.Read, UserPermission.Update, UserPermission.Delete,
                ProductPermission.Create, ProductPermission.Read, ProductPermission.Update, ProductPermission.Delete,
                MessagePermission.Create, MessagePermission.Read, MessagePermission.Update, MessagePermission.Delete
            ];
        } else {
            // For non-admin users, return a limited set of permissions
            Logger.debug(`User ${user_data.email} is not an admin, granting limited permissions.`);
            return [ProductPermission.Read, MessagePermission.Read];
        }
        return [];
    }

}
