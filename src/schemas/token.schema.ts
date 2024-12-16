import Joi from "joi";

import {symbol} from "../lib/joi/common";

export const fetchTokenSchema = Joi.object().keys({
    symbol: symbol.required()
})