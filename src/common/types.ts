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

import { MessagePermission } from "../modules/messages/permissions";
import { ProductPermission } from "../modules/products/permissions";
import { UserPermission } from "../modules/users/permissions";

export interface JwtJson {
    id: String | undefined,
    email: String | undefined,
    accessToken: String | undefined,
    refreshToken: String | undefined,
    tokenExpiration: number,
    tokenType: String
}

export interface SubscribingUser {
    firstName: String | undefined,
    lastName: String | undefined,
    email: String,
    role: String | undefined // not used
}

export type Permission = UserPermission | ProductPermission | MessagePermission;

