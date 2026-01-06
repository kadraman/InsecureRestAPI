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

export interface IProduct {
    _id?: String;
    code: String;
    name: String;
    summary: String;
    description: String;
    image: String;
    price: Number;
    on_sale: Boolean;
    sale_price: Number;
    in_stock: Boolean;
    time_to_stock: Number;
    rating: Number;
    available: Boolean;
    is_deleted?: Boolean;
    modification_notes: ModificationNote[]
}
