import { ClientErrorDetails } from "../interfaces/common.interface";
import { HttpStatus } from "./enums/http-status.enum";
import { HttpException } from "./http.exception";

export class BadRequestException extends HttpException {
    constructor(body: { details: ClientErrorDetails[] }) {
        super(body.details, HttpStatus.BAD_REQUEST);
        this.message = "Bad Request Exception";
    }
}