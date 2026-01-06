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

import {IMessage} from './model';
import messages from './schema';

export default class MessageService {

    public filterMessages(query: any, offset: number = 0, limit: number = 50, callback: any) {
        messages.find(query, callback).skip(offset).limit(limit);
    }

    public filterMessage(query: any, callback: any) {
        messages.findOne(query, callback);
    }

    public createMessage(message_params: IMessage, callback: any) {
        const _session = new messages(message_params);
        _session.save(callback);
    }

    public updateMessage(message_params: IMessage, callback: any) {
        const query = {_id: message_params._id};
        messages.findOneAndUpdate(query, message_params, callback);
    }

    public deleteMessage(_id: String, callback: any) {
        const query = {_id: _id};
        messages.deleteOne(query, callback);
    }

}
