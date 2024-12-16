import { ClientErrorDetails } from "../interfaces/common.interface";
import { HttpStatus } from "./enums/http-status.enum";
import { HttpException } from "./http.exception";

export class NotFoundException extends HttpException {
    constructor(body?: { details: ClientErrorDetails[] }) {
        super(body?.details || [], HttpStatus.NOT_FOUND);
        this.message = "Not Found";
    }
}