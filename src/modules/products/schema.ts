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

import mongoose from 'mongoose';
import {ModificationNote} from '../common/model';

const Schema = mongoose.Schema;

const schema = new Schema({
    code: String,
    name: String,
    summary: String,
    description: String,
    image: String,
    price: {
        type: Number,
        default: 0.0
    },
    on_sale: {
        type: Boolean,
        default: false
    },
    sale_price: {
        type: Number,
        default: 0.0
    },
    in_stock: {
        type: Boolean,
        default: true
    },
    time_to_stock: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 1
    },
    available: {
        type: Boolean,
        default: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    modification_notes: [ModificationNote]
});
schema.index({'$**': 'text'});

export default mongoose.model('products', schema);
