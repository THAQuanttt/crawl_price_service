import { ClientErrorDetails } from "../interfaces/common.interface";

export interface HttpExceptionOptions {
    cause?: Error;
    description?: string;
}

export interface ErrorResponseType {
    message: string,
    details: ClientErrorDetails[] | [],
    status: number
}

export class HttpException extends Error {
    constructor(private details: ClientErrorDetails[] | [], private status: number, private opstions?: HttpExceptionOptions) {
        super();
    }

    getErrorResponse(): ErrorResponseType {
        const errorResponseObject = {
            message: this.message,
            details: this.details,
            status: this.status
        }

        return errorResponseObject;
    }
}