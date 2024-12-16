import { Response, Request, NextFunction } from "express";
import { Schema } from "joi";
import { BadRequestException } from "../../lib/exceptions";
interface IValidateSchema {
    body?: Schema;
    query?: Schema;
    params?: Schema;
}

export const validator = (params?: IValidateSchema) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        validate(req.body, next, params?.body);
        validate(req.query, next, params?.query);
        validate(req.params, next, params?.params);
        next();
    };
};

const validate = (req: unknown, next: NextFunction, schema?: Schema) => {
    if (schema) {
        const { error } = schema.validate(req, {
            abortEarly: false,
            convert: true,
        });
        if (error) next(new BadRequestException({
            details: [{ issue:error.message }]
        }));
    }
};
