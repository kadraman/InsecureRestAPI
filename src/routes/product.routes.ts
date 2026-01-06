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
import { expressjwt as jwt } from 'express-jwt';
const guard = require('express-jwt-permissions')();

import {ProductController} from '../controllers/product.controller';
import Logger from "../middleware/logger";
import { IProduct } from '../modules/products/model';
import {badRequest, mongoError, successResponse} from "../modules/common/service";
import {EncryptUtils} from "../utils/encrypt.utils";
import { body, param, validationResult } from 'express-validator';


const product_controller: ProductController = new ProductController();

export const productRoutes = Router();

productRoutes.get('/api/v1/products', 
    [
        guard.check(['read:products'])
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Find products by keyword(s)"
        #swagger.description = "Gets all existing products searching by %keyword% format"
        #swagger.operationId = "getProducts"
        #swagger.parameters['keywords'] = {
            in: 'query',
            description: 'Keyword(s) search for products to be found.',
            type: 'string'
        }
        #swagger.parameters['offset'] = {
            in: 'query',
            description: 'Offset of the starting record. 0 indicates the first record.',
            type: 'number'
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Maximum records to return. The maximum value allowed is 50.',
            type: 'number'
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

    product_controller.get_products(req, res);
});

productRoutes.get('/api/v1/products/:id', 
    [
        guard.check(['read:products']),
        param('id').isString().withMessage('A product Id is required'),
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Get a product"
        #swagger.description = "Gets an existing product"
        #swagger.operationId = "getProductById"
        #swagger.parameters['id'] = {
            description: 'Id of the product to be retrieved. Cannot be empty.'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[404] = {
            description: "Product Not Found",
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
        product_controller.get_product(req, res);
    }
});

productRoutes.get('/api/v1/products/:id/image', 
    [
        guard.check(['read:products']),
        param('id').isString().withMessage('A product Id is required'),
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Get product image by Id"
        #swagger.description = "Gets an existing product's image by its Id"
        #swagger.operationId = "getProductImageById"
        #swagger.parameters['name'] = {
            description: 'Id of the product image to be retrieved. Cannot be empty.'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[404] = {
            description: "Product Not Found",
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
        product_controller.get_product_image_by_id(req, res);
    }
});

productRoutes.get('/api/v1/products/:name/image-by-name', 
    [
        guard.check(['read:products']),
        param('name').isString().withMessage('A product name is required'),
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Get product image by name"
        #swagger.description = "Gets an existing product's image by its uploaded name"
        #swagger.operationId = "getProductImageByName"
        #swagger.parameters['name'] = {
            description: 'Name of the product image to be retrieved. Cannot be empty.'
        }
        #swagger.responses[200] = {
            description: "Success",
            schema: { $ref: '#/components/schemas/success' }
        }
        #swagger.responses[400] = {
            description: "Bad Request",
            schema: { $ref: '#/components/schemas/failure' }
        }
        #swagger.responses[404] = {
            description: "Image Not Found",
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
        product_controller.get_product_image_by_name(req, res);
    }
});


productRoutes.post('/api/v1/products', 
    [
        guard.check(['create:products']),
        body('code').isString().withMessage('A product code is required'),
        body('name').isString().withMessage('A product name is required'),
        body('summary').isString().withMessage('A product summary is required')
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Create new product"
        #swagger.description = "Creates a new product"
        #swagger.operationId = "createProduct"
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/product"
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
        #swagger.responses[403] = {
            description: "Forbidden",
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
        res.setHeader('Content-Type', 'application/json');
        product_controller.create_product(req, res);
    }
});

productRoutes.put('/api/v1/products/:id', 
    [
        guard.check(['update:products']),
        param('id').isString().withMessage('A product Id is required'),
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Update a product"
        #swagger.description = "Updates an existing product"
        #swagger.operationId = "updateProduct"
        #swagger.parameters['id'] = {
            description: 'Id of the product to be updated. Cannot be empty.'
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
        #swagger.responses[403] = {
            description: "Forbidden",
            schema: { $ref: '#/components/schemas/failure' }
        }            
        #swagger.responses[404] = {
            description: "Product Not Found",
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
        product_controller.update_product(req, res);
    }
});

productRoutes.delete('/api/v1/products/:id', 
    [
        guard.check(['delete:products']),
        param('id').isString().withMessage('A product Id is required'),
    ], (req: Request, res: Response) => {

    /*
        #swagger.tags = ['Products']
        #swagger.summary = "Delete a product"
        #swagger.description = "Deletes an existing product"
        #swagger.operationId = "deleteProduct"
        #swagger.parameters['id'] = {
            description: 'Id of the product to be deleted. Cannot be empty.'
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
        #swagger.responses[403] = {
            description: "Forbidden",
            schema: { $ref: '#/components/schemas/failure' }
        }            
        #swagger.responses[404] = {
            description: "Product Not Found",
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
        product_controller.delete_product(req, res);
    }
});


