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

import config from 'config';

import mongoose from 'mongoose';

import dotenv from 'dotenv';
import Logger from "../middleware/logger";

import users from '../modules/users/schema';
import products from '../modules/products/schema';
//import reviews from '../modules/reviews/schema';
import messages from '../modules/messages/schema';

dotenv.config();


import MongoMemoryServer from 'mongodb-memory-server-core';
import { EncryptUtils } from '../utils/encrypt.utils';

class DbConfig {
  private curEnv: string = config.util.getEnv('NODE_ENV');
  private dbHost: string = config.get('App.dbConfig.host') || 'localhost';
  private dbPort: number = config.get('App.dbConfig.port') || 27017;
  private dbName: string = config.get('App.dbConfig.database') || 'iwa';
  private dbUser: string = config.get('App.dbConfig.user') || 'iwa';
  private dbPassword: string = config.get('App.dbConfig.password') || 'iwa';

  public mongoUri: string | undefined;

  constructor() {

  }

  public getmongoUri(): string {
    if (this.mongoUri) {
      return this.mongoUri;
    } else {
      throw new Error('MongoDB URL is not set. Please initialize the database connection first.');
    }
  }

  public async init(): Promise<void> {
    const mongoServer = await MongoMemoryServer.create();
    this.mongoUri = mongoServer.getUri();
    Logger.info(`Using in-memory MongoDB at ${this.mongoUri}`);
  }

  public async connect(populate: boolean): Promise<void> {
    if (this.mongoUri === undefined) {
      await this.init();
    }
    // Wait for the connection to be established
    await new Promise<void>((resolve, reject) => {
      if (this.mongoUri) {
        mongoose.connect(this.mongoUri!, {
          dbName: this.dbName,
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
          useFindAndModify: false
        }).then(() => {
          resolve();
        }).catch((err) => {
          reject(err);
        });
      } else {
        reject(new Error('Database connection is not initialized.'));
      }
    });
    Logger.debug(`Connected to MongoDB at ${this.mongoUri}`);
    if (populate) {
      await this.populate();
    }
    Logger.info('In-memory MongoDB is ready for use.');
  }

  public async disconnect(): Promise<void> {
    // Close the connection to the in-memory MongoDB instance
    if (mongoose.connection) {
      await mongoose.connection.close();
      Logger.debug('Disconnected from in-memory MongoDB');
    } else {
      Logger.warn('No active MongoDB connection to close.');
    }
  }

  public async populate(): Promise<void> {
    // This method can be used to populate the database with initial data.
    Logger.info('Populating in-memory MongoDB with initial data...');
    await Promise.all([
        this.userCreate(0, "4202afd7-7cd1-40b0-ba50-b58eb73b92be", "Admin", "", "User", "admin@localhost.com", "0123456789", true),
        this.userCreate(1, "6a5d1f06-68c4-4edf-a2f3-3727f29d19a5", "Sam", "A", "Shopper", "user1@localhost.com", "0123456789", false),
        this.userCreate(2, "8365e972-ac18-4497-95e6-2780271505f2", "Sarah", "A", "Shopper", "user2@localhost.com", "0123456789", false),
    ]);
    await Promise.all([
        this.productCreate(0, "SWA234-A568-00010", "Solodox 750", "generic-product-4.jpg",
            12.95, false, 0, true, 30,4, true
        ),
        this.productCreate(1, "SWA534-F528-00115", "Alphadex Plus", "generic-product-1.jpg",
            14.95, true, 9.95, true, 30,5, true
        ),
        this.productCreate(2, "SWA179-G243-00101", "Dontax", "generic-product-2.jpg",
            8.50, false, 0, true, 30,3, true
        ),
        this.productCreate(3, "SWA201-D342-00132", "Tranix Life", "generic-product-3.jpg",
            7.95, true, 4.95, true, 14,5, true
        ),
        this.productCreate(4, "SWA312-F432-00134", "Salex Two", "generic-product-5.jpg",
            11.95, false, 0, true, 14,5, true
        ),
        this.productCreate(5, "SWA654-F106-00412", "Betala Lite", "generic-product-4.jpg",
            11.95, false, 0, true, 30,5, true
        ),
        this.productCreate(6, "SWA254-A971-00213", "Stimlab Mitre", "generic-product-6.jpg",
            12.95, false, 0, true, 7,5, true
        ),
        this.productCreate(7, "SWA754-B418-00315", "Alphadex Lite", "generic-product-7.jpg",
            9.95, false, 0, true, 30,2, true
        ),
        this.productCreate(8, "SWA432-E901-00126", "Villacore 2000", "generic-product-8.jpg",
            19.95, false, 0, true, 30,2, true
        ),
        this.productCreate(9, "SWA723-A375-00412", "Kanlab Blue", "generic-product-9.jpg",
            9.95, false, 0, true, 7,5, true
        ),
    ]);
      await Promise.all([
        this.messageCreate(0, "6a5d1f06-68c4-4edf-a2f3-3727f29d19a5", "Welcome to InsecureRestAPI. This is an example message that you can read"),
        this.messageCreate(1, "6a5d1f06-68c4-4edf-a2f3-3727f29d19a5", "Test message - please ignore!"),
        this.messageCreate(2, "8365e972-ac18-4497-95e6-2780271505f2", "Welcome to InsecureRestAPI. This is an example message that you can read"),
        this.messageCreate(3, "8365e972-ac18-4497-95e6-2780271505f2", "Test message - please ignore!"),
    ]);
  }

  //

  private async userCreate(index: number, user_id: string, firstName: string, middle_name: string, lastName:string, 
      email:string, phoneNumber:string, is_admin: boolean): Promise<void> {
      const userdetail =
          {
              user_id: user_id,
              name: {
                  firstName: firstName,
                  middle_name: middle_name,
                  lastName: lastName,
              },
              email: email,
              phoneNumber: phoneNumber,
              password: EncryptUtils.cryptPassword("password"), // Default "password" for demo purposes
              address: {
                  street: "1 Somewhere Street",
                  city: "London",
                  state: "Greater London",
                  zip: "SW1",
                  country: "United Kingdom"
              },
              is_enabled: true,
              is_admin: is_admin,
              mfa_enabled: false,
              is_deleted: false
          };

      const user = new users(userdetail);
      await user.save();
      Logger.debug(`Added user: ${firstName} ${lastName}`);
  }

  private async productCreate(index: number, code: string, name: string, image: string, price: number, on_sale: boolean, 
    sale_price: number, in_stock: boolean, time_to_stock: number, rating: number, available: boolean): Promise<void> {
      const productdetail =
          {
              code: code,
              name: name,
              summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra enim erat, sed tempor mauris viverra in. Donec ante diam, rhoncus dapibus efficitur ut, sagittis a elit. Integer non ante felis. Curabitur nec lectus ut velit bibendum euismod. Nulla mattis convallis neque ac euismod. Ut vel mattis lorem, nec tempus nibh. Vivamus tincidunt enim a risus placerat viverra. Curabitur diam sapien, posuere dignissim accumsan sed, tempus sit amet diam. Aliquam tincidunt vitae quam non rutrum. Nunc id sollicitudin neque, at posuere metus. Sed interdum ex erat, et ornare purus bibendum id. Suspendisse sagittis est dui. Donec vestibulum elit at arcu feugiat porttitor.",
              description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin pharetra enim erat, sed tempor mauris viverra in. Donec ante diam, rhoncus dapibus efficitur ut, sagittis a elit. Integer non ante felis. Curabitur nec lectus ut velit bibendum euismod. Nulla mattis convallis neque ac euismod. Ut vel mattis lorem, nec tempus nibh. Vivamus tincidunt enim a risus placerat viverra. Curabitur diam sapien, posuere dignissim accumsan sed, tempus sit amet diam. Aliquam tincidunt vitae quam non rutrum. Nunc id sollicitudin neque, at posuere metus. Sed interdum ex erat, et ornare purus bibendum id. Suspendisse sagittis est dui. Donec vestibulum elit at arcu feugiat porttitor.",
              image: image,
              price: price,
              on_sale: on_sale,
              in_stock: in_stock,
              time_to_stock: time_to_stock,
              rating: rating,
              available: available
          };
      const product = new products(productdetail);
      await product.save();
      Logger.debug(`Added product: ${code}`);
  }

  private async messageCreate(index: number, user_id: string, text: string): Promise<void> {
      const messagedetail =
          {
              user_id: user_id,
              text: text,
              sent_date: new Date(Date.now()),
              is_read: false,
              is_deleted: false
          };
      const message = new messages(messagedetail);
      await message.save();
      Logger.debug(`Added message: ${user_id}  - ${text}`);
  }
  

}

export default new DbConfig();
