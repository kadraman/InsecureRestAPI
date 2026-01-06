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

import {Response} from 'express';
import moment from 'moment';

import {response_status_codes} from './model';

export function successResponse(message: string, data: any, res: Response) {
    if (data == null) { data = {};}
    res.status(response_status_codes.success).json({
        status: 'success',
        timestamp: moment().format(),
        message: message,
        data
    });
}

export function failureResponse(message: string, data: any, res: Response) {
    res.status(response_status_codes.bad_request).json({
        status: 'failure',
        timestamp: moment().format(),
        message: message,
        data
    });
}

export function badRequest(res: Response, data?: any, message?: string) {
    res.status(response_status_codes.bad_request).json({
        status: 'failure',
        timestamp: moment().format(),
        message: message ?? "Bad Request",
        data: data ?? {}
    });
}

export function notFound(res: Response, data?: any, message?: string) {
    res.status(response_status_codes.bad_request).json({
        status: 'failure',
        timestamp: moment().format(),
        message: message ?? "Not Foundt",
        data: data ?? {}
    });
}

export function unauthorised(message: string, res: Response) {
    res.status(response_status_codes.unauthorized).json({
        status: 'failure',
        timestamp: moment().format(),
        message: message
    });
}

export function forbidden(message: string, res: Response) {
    res.status(response_status_codes.forbidden).json({
        status: 'failure',
        timestamp: moment().format(),
        message: message
    });
}

export function mongoError(err: any, res: Response) {
    res.status(response_status_codes.internal_server_error).json({
        status: 'failure',
        timestamp: moment().format(),
        message: 'MongoDB error',
        data: err
    });
}

export function internalError(err: any, res: Response) {
    res.status(response_status_codes.internal_server_error).json({
        status: 'failure',
        timestamp: moment().format(),
        message: 'Unknown internal error',
        data: err
    });
}

