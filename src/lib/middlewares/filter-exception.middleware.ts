import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpStatus } from "../exceptions/enums/http-status.enum";
import { HttpException } from "../exceptions/http.exception";

const filterExceptionMiddleware = (error: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof HttpException) {
        const errorResponse = error.getErrorResponse();
        return res.status(errorResponse.status).json(errorResponse);
    }

    return res.status(500).json({
        message: "Internal Server Error",
        details: [{ issue: (error as any)?.message || '' }],
        status: HttpStatus.INTERNAL_SERVER_ERROR
    });
}

export default filterExceptionMiddleware;
