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

import {IUser} from './model';
import users from './schema';

export default class UserService {

    public filterUsers(query: any, offset: number = 0, limit: number = 50, callback: any) {
        users.find(query, callback).skip(offset).limit(limit);
    }

    public filterUser(query: any, callback: any) {
        users.findOne(query, callback);
    }

    public createUser(user_params: IUser, callback: any) {
        const _session = new users(user_params);
        _session.save(callback);
    }

    public updateUser(user_params: IUser, callback: any) {
        const query = {user_id: user_params.user_id};
        users.findOneAndUpdate(query, user_params, callback);
    }

    public deleteUser(user_id: String, callback: any) {
        const query = {user_id: user_id};
        users.deleteOne(query, callback);
    }

}
