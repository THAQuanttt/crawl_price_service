import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ClientErrorDetails } from '../interfaces/common.interface';
import { BadRequestException } from '../exceptions';

export const Validation = (type: new () => {}) => {
  return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (req: Request, res: Response, _next: NextFunction) {
      const object = plainToInstance(type, req.body);
      const errors = await validate(object);

      if (errors.length > 0) {
        const details: ClientErrorDetails[] = [];

        for (const error of errors) {
          const violatedConstraints: string[] = [];

          for (const constraint in error.constraints) {
            const message = error.constraints[constraint];
            violatedConstraints.push(message);
          }

          const clientErrorDetails = {
            field: error.property,
            issue: violatedConstraints.join(', '),
          };

          details.push(clientErrorDetails);
        }

        throw new BadRequestException({ details });
      } else {
        originalMethod.apply(this, arguments);
      }
    };
  };
}