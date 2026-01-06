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

import swaggerAutogen from 'swagger-autogen';
import config from 'config';

const appName: string = config.has('App.name') ? config.get('App.name') : "InsecureRestAPI";
const appUrl: string = config.has('App.apiConfig.url') ? config.get('App.apiConfig.url') : "http://localhost:5000/api-docs/";
const appVersion: string = config.has('App.version') ? config.get('App.version') : "v1";
const appDescription: string = config.has('App.description') ? config.get('App.description') : "An insecure NodeJS/Express/MongoDB REST API for educational purposes.";
const appEnv: string = process.env.NODE_ENV || 'development';
const appPort: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

const doc = {
    info: {
        title: `${appName}`,
        version: `${appVersion}`,
        description: `<b>${appDescription}</b>\n\nYou can select a development or production server to test the API. Most operations require authentication via a user specific JWT token. To retrieve a JWT token for a user you can use the Site <code>'/api/v1/site/sign-in'</code> operation below and then copy the value of the <b>accessToken</b> field. This value can then be entered when you click on the <b>Authorize</b> button or lock icons.\n\n[View Schema](/docs/openapi.json)`,
        license: {
            name: "GPLv3",
            url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
        },
        contact: {
            name: "Kevin A. Lee (kadraman)",
            url: "https://github.com/kadraman",
        }
    },
    components: {
        schemas: {
            user: {
                $user_id: "87cd9f67-d160-4487-ba95-cb889a47cf2d",
                $name: {
                    $firstName: "User",
                    $middle_name: "",
                    $lastName: "One"
                },
                $email: "user1@localhost.com",
                $phoneNumber: "1234567890",
                $password: "string",
                $address: {
                    $street: "string",
                    $city: "string",
                    $state: "string",
                    $zip: "string",
                    $country: "string",
                },
                $is_enabled: true,
                $is_admin: false,
                $mfa_enabled: false
            },
            registerUser: {
                $firstName: "User",
                $middle_name: "A",
                $lastName: "One",
                $email: "user1@localhost.com",
                $phoneNumber: "1234567890",
                $password: "string"
            },
            subscribeUser: {
                $firstName: "User",
                $lastName: "One",
                $email: "user1@localhost.com"
            },
            signInUser: {
                $email: "string",
                $password: "string"
            },
            signOutUser: {
                $accessToken: "string"
            },
            refreshUser: {
                $refreshToken: "string"
            },
            product: {
                $code: "SWA-123-456-789",
                $name: "Product Name",
                $summary: "An example summary.",
                $description: "This is an example description of the product.",
                $image: "image-filename",
                $price: 10.0,
                $on_sale: false,
                $sale_price: 10.0,
                $in_stock: true,
                $time_to_stock: 0,
                $rating: 1,
                $available: true
            },
            message: {
                $user_id: "87cd9f67-d160-4487-ba95-cb889a47cf2d",
                $text: "This is an example message",
                $sent_date: "YYYY-MM-DDTHH:mm:ssZ",
                $read_date: "YYYY-MM-DDTHH:mm:ssZ",
                $is_read: true,
                $is_deleted: false
            },
            success: {
                $status: "success",
                $message: "string",
                $timestamp: "YYYY-MM-DDTHH:mm:ssZ",
                $data: {}
            },
            failure: {
                $status: "failure",
                $message: "string",
                $timestamp: "YYYY-MM-DDTHH:mm:ssZ",
                $data: {}
            }
        },
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                description: 'Access Token'
            }
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
    servers: [
        {
            url: `${appUrl}`,
            description: `${appName} - ${appEnv} `,
        },
    ]
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
    '../routes/site.routes.ts', 
    '../routes/product.routes.ts',
    '../routes/message.routes.ts',
    '../routes/user.routes.ts'
];

swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
