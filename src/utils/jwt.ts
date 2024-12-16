import * as jwt from 'jsonwebtoken';
import { config } from '../config/configuration';
import { JwtPayloadUser } from '../lib/interfaces/request.interface';


export const signToken = (payload: any): string => {
    return jwt.sign(payload, config.JWT_SECRET_KEY, { expiresIn: '1d' });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, config.JWT_SECRET_KEY) as JwtPayloadUser;
}