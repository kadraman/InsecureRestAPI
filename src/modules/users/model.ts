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

import {ModificationNote} from "../common/model";

export interface IUser {
    _id?: String;
    user_id: String;
    name: {
        firstName: String;
        middle_name: String;
        lastName: String;
    };
    email: String;
    password: String;
    phoneNumber: String;
    address: {
        street: String;
        city: String;
        state: String;
        zip: String;
        country: String;
    }
    verify_code?: String;
    is_enabled: Boolean;
    password_reset?: Boolean;
    mfa_enabled: Boolean;
    is_admin: Boolean;
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}
