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

import {Request, Response, Router} from 'express';

import {SiteController} from "../controllers/site.controller";
import {AuthorizationHandler} from "../middleware/authorization.handler";
import { body, param, query, validationResult } from 'express-validator';
import { badRequest, failureResponse, successResponse } from '../modules/common/service';

const site_controller: SiteController = new SiteController();

export const siteRoutes = Router();

siteRoutes.get('/api/v1/site/status', 
    [
        AuthorizationHandler.permitAll
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Get the site status"
        #swagger.description = "Get the site message of the day"
        #swagger.operationId = "getSiteStatus"
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    site_controller.site_status(req, res);
});

siteRoutes.get('/api/v1/site/email-already-exists/:email', 
    [
        AuthorizationHandler.permitAll,
        param('email').isEmail().withMessage('A valid email parameter is required'),
    ], (req: Request, res: Response) => {

    /*
       #swagger.tags = ['Site']
       #swagger.summary = "Check if email is taken"
       #swagger.description = "Check if a user with the specified email already exists in the site"
           #swagger.parameters['email'] = {
               in: 'query',
               description: 'Email address to check. Cannot be empty.',
               type: 'string'
           }
           #swagger.responses[200] = {
               description: "Success",
               schema: { $ref: '#/components/schemas/success' }
           }
           #swagger.responses[400] = {
               description: "Bad Request",
               schema: { $ref: '#/components/schemas/failure' }
           }
           #swagger.responses[500] = {
               description: "Internal Server Error",
               schema: { $ref: '#/components/schemas/failure' }
           }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        successResponse("The email address is available.", null, res)
    }
});

siteRoutes.post('/api/v1/site/register-user', 
    [
        AuthorizationHandler.permitAll,
        body('firstName').isString().withMessage('A first name is required'),
        body('lastName').isString().withMessage('A last name is required'),
        body('email').isEmail().withMessage('A valid email is required'),
        body('phoneNumber').isString().withMessage('A valid mobile phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('A password is required with length of at least 6 characters'),

    ], (req: Request, res: Response) => {
    /*
       #swagger.tags = ['Site']
       #swagger.summary = "Register a new user"
       #swagger.description = "Register a new user with the site"
             #swagger.requestBody = {
                 required: true,
                 content: {
                     "application/json": {
                         schema: {
                             $ref: "#/components/schemas/registerUser"
                         }
                     }
                 }
             }
           #swagger.responses[200] = {
               description: "Success",
               schema: { $ref: '#/components/schemas/success' }
           }
           #swagger.responses[400] = {
               description: "Bad Request",
               schema: { $ref: '#/components/schemas/failure' }
           }
           #swagger.responses[409] = {
               description: "User Already Exists",
               schema: { $ref: '#/components/schemas/failure' }
           }
           #swagger.responses[500] = {
               description: "Internal Server Error",
               schema: { $ref: '#/components/schemas/failure' }
           }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        successResponse("User registered successfully.", null, res)
    }
});

siteRoutes.post('/api/v1/site/subscribe-user', 
    [
        AuthorizationHandler.permitAll,
        body('firstName').isString().withMessage('A first name is required'),
        body('lastName').isString().withMessage('A last name is required'),
        body('email').isEmail().withMessage('A valid email is required')
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Subscribe a new user"
        #swagger.description = "Subscribe a new user to the newsletter"
        #swagger.operationId = "subscribeUser"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/subscribeUser"
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
           #swagger.responses[409] = {
               description: "User Already Exists",
               schema: { $ref: '#/components/schemas/failure' }
           }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        site_controller.subscribe_user(req, res);
    }
});

siteRoutes.post('/api/v1/site/sign-in', 
    [
        AuthorizationHandler.permitAll,
        body('email').isEmail().withMessage('A valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('A password is required with length of at least 6 characters'),
    ], 
    (req: Request, res: Response) => {

    /*
       #swagger.tags = ['Site']
       #swagger.summary = "Sign-in"
       #swagger.description = "Sign in as an authorised user"
             #swagger.requestBody = {
                 required: true,
                 content: {
                     "application/json": {
                         schema: {
                             $ref: "#/components/schemas/signInUser"
                         }
                     }
                 }
             }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[401] = {
            description: "Unauthorized",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        site_controller.login_user(req, res);
        // INTENTIONAL - educational: Reflecting `req.url` into a cookie and
        // omitting `secure: true` is insecure but included here for
        // demonstration and scanner detection. Do not mirror request values
        // into cookies in production and set `secure: true` for TLS-only cookies.
        res.cookie("user", req.url, {httpOnly: true, expires: new Date(Date.now() + 900000)});
    }
});

siteRoutes.post('/api/v1/site/sign-out', 
    [
        AuthorizationHandler.permitAll,
        body('accessToken').isJWT().withMessage('A valid accessToken is required'),
    ], (req: Request, res: Response) => {

    /*
       #swagger.tags = ['Site']
       #swagger.summary = "Sign-out"
       #swagger.description = "Sign out an authorised user"
             #swagger.requestBody = {
                 required: true,
                 content: {
                     "application/json": {
                         schema: {
                             $ref: "#/components/schemas/signOutUser"
                         }
                     }
                 }
             }
       #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        successResponse("User signed out successfully.", null, res)
    }
});

siteRoutes.post('/api/v1/site/refresh-token', 
    [
        AuthorizationHandler.permitAll,
        body('refreshToken').isJWT().withMessage('A valid accessToken is required'),
    ], (req: Request, res: Response) => {

    /*
       #swagger.tags = ['Site']
       #swagger.summary = "Refresh token"
       #swagger.description = "Refresh users JwtAuthHandler access token"
             #swagger.requestBody = {
                 required: true,
                 content: {
                     "application/json": {
                         schema: {
                             $ref: "#/components/schemas/refreshUser"
                         }
                     }
                 }
             }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[401] = {
            description: "Unauthorized",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
    */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      badRequest(res, errors.array(), "Invalid parameters");
    } else {
        successResponse("User accessToken refreshed successfully.", null, res)
    }
});

siteRoutes.post('/api/v1/site/backup-newsletter-db', 
    [
        AuthorizationHandler.permitAll,
        query('filePath').isString().withMessage("A valid filePath is required")
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Site']
        #swagger.summary = "Backup the newsletter database"
        #swagger.description = "Compress and backup the newsletter database to the specified file"
        #swagger.operationId = "backupNewsletterDb"
        #swagger.parameters['filePath'] = {
            in: 'query',
            description: 'The file to backup the database to. Cannot be empty.',
            type: 'string'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[500] = {
            description: "Internal Server Error",
            schema: { $ref: '#/components/schemas/failure' }
        }
   */

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        badRequest(res, errors.array(), "Invalid parameters");
    } else {
        site_controller.backup_newsletter_db(req, res);
    }
});

/*siteRoutes.post('/api/site/upload-image', function(request, response) {
    fs.writeFileSync(`/tmp/upload/${request.body.name}`);

    // convert the image to correct size and format
    convert({
        file: `/tmp/upload/${request.body.name}`,
        width: 600,
        height: 400,
        type: 'jpeg'
    }).then(response => {
        // Command injection example
        exec('rm /tmp/upload/${request.body.name}');
        return response.sendStatus(200);
    }).catch(error => {
        return response.sendStatus(500);
    })

});*/
