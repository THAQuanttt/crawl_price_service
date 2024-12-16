import { Request, Response, NextFunction } from 'express';
import { CustomUserRequest } from '../interfaces/request.interface';

export const RoleGuard = (roles: string[]) => {
    return function (_target: any, _propertyName: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (req: Request, res: Response, _next: NextFunction) {
            const _req = req as CustomUserRequest;

            if(!_req.user)
                return res.status(402).json({ message: "Unauthorize" });

            const rolesSetSize = new Set([..._req.user.roles, ...roles]).size;
            if (rolesSetSize < _req.user.roles.length + roles.length) {
                originalMethod.apply(this, arguments);
            } else {
                return res.status(402).json({ message: "Unauthorize" });
            }
        };
    };
}