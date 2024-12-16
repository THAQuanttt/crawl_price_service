import Joi from "joi";

export const symbol = Joi.string().custom((value, helper) => {
    if (!value) return helper.message({ custom: "Invalid Symbol" });
    // Conver value to String
    if (typeof value.toString === "function") {
        return value.toString();
    }
    return helper.message({ custom: "Symbol must be convertible to a string" });
});

export const page = Joi.number().min(0); 
export const limit = Joi.number().min(5);
export const sort = Joi.string().valid("desc", "asc");
