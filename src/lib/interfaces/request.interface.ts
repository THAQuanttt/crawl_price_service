import { Request } from "express"

export interface JwtPayloadUser {
    userId: string;
    roles: string[];
}

export interface CustomUserRequest extends Request {
    user: JwtPayloadUser
};