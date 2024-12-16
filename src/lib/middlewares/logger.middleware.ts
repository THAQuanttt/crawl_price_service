import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";

const loggerMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
        logger.log('info', { query: { ...req.query }, params: { ...req.params } });
    }
    if (req.method === 'POST') {
        logger.log('info', { body: req.body });
    }
    next();
}

export default loggerMiddleware;