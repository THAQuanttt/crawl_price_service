import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "../exceptions";


const notFoundMiddleware = (_req: Request, res: Response, _next: NextFunction) => {
    throw new NotFoundException();
}

export default notFoundMiddleware;