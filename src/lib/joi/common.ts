import Joi from "joi";

export const symbol = Joi.string().custom((value, helper) => {
    if (!value) return helper.message({ custom: "Invalid address" });
    return value;
});

export const page = Joi.number().min(0); 
export const limit = Joi.number().min(5);
export const sort = Joi.string().valid("desc", "asc");
