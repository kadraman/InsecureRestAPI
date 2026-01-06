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

import {Request, Response} from 'express';

import {failureResponse, badRequest, mongoError, successResponse} from '../modules/common/service';
import {IMessage} from '../modules/messages/model';
import {EncryptUtils} from "../utils/encrypt.utils";
import Logger from "../middleware/logger";

import MessageService from '../modules/messages/service';

export class MessageController {

    private message_service: MessageService = new MessageService();

    public get_messages(req: Request, res: Response) {
        Logger.debug(`Retrieving messages(s) using query: ${JSON.stringify(req.query)}`);
        let message_filter = (req.query.keywords ? {$text: {$search: req.query.keywords}} : {});
        let offset = (req.query.offset ? Number(req.query.offset) : 0);
        let limit = (req.query.limit ? Number(req.query.limit) : 0);
        this.message_service.filterMessages(message_filter, offset, limit, (err: any, message_data: IMessage) => {
            if (err) {
                mongoError(err, res);
            } else {
                successResponse('Successfully retrieved message(s)', message_data, res);
            }
        });
    }

    public get_message(req: Request, res: Response) {
        Logger.debug(`Retrieving message with params: ${JSON.stringify(req.params)}`);
        if (req.params.id) {
            const message_filter = {message_id: req.params.id};
            this.message_service.filterMessage(message_filter, (err: any, message_data: IMessage) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('Successfully retrieved message', message_data, res);
                }
            });
        } else {
            badRequest(res);
        }
    }

    public create_message(req: Request, res: Response) {
        Logger.debug(`Creating message with request body: ${JSON.stringify(req.body)}`);
        // this checks whether all the fields were sent through with the request or not
        if (req.body.user_id && req.body.text) {

            const message_params: IMessage = {
                user_id: req.body.user_id,
                text: req.body.text,
                is_read: false,
                sent_date: new Date(Date.now()),
                read_date: new Date(Date.now())
            };
            this.message_service.createMessage(message_params, (err: any, message_data: IMessage) => {
                if (err) {
                    mongoError(err, res);
                } else {
                    successResponse('Successfully created message', message_data, res);
                }
            });
        } else {
            // error response if some fields are missing in request body
            badRequest(res);
        }
    }

    public update_message(req: Request, res: Response) {
        Logger.debug(`Updating message with params: ${JSON.stringify(req.params)}`);
        if (req.params.id) {
            const message_filter = {message_id: req.params.id};
            this.message_service.filterMessage(message_filter, (err: any, message_data: IMessage) => {
                if (err) {
                    mongoError(err, res);
                } else if (message_data) {
                    const message_params: IMessage = {
                        user_id: req.params.id,
                        text: req.body.text ? req.body.text : message_data.text,
                        sent_date: req.body.sent_date ? req.body.sent_date : message_data.sent_date,
                        read_date: req.body.read_date ? req.body.read_date : message_data.read_date,    
                        is_read: req.body.is_read ? req.body.is_read : message_data.is_read,
                        is_deleted: req.body.is_deleted ? req.body.is_deleted : message_data.is_deleted,
                    };
                    this.message_service.updateMessage(message_params, (err: any) => {
                        if (err) {
                            mongoError(err, res);
                        } else {
                            successResponse('Successfully updated message', null, res);
                        }
                    });
                } else {
                    failureResponse('Invalid message', null, res);
                }
            });
        } else {
            badRequest(res);
        }
    }

    public delete_message(req: Request, res: Response) {
        Logger.debug(`Deleting message with params: ${JSON.stringify(req.params)}`);
        if (req.params.id) {
            this.message_service.deleteMessage(req.params.id, (err: any, delete_details: any) => {
                if (err) {
                    mongoError(err, res);
                } else if (delete_details.deletedCount !== 0) {
                    successResponse('Successfully deleted message', null, res);
                } else {
                    failureResponse('Invalid message', null, res);
                }
            });
        } else {
            badRequest(res);
        }
    }
}
