import { ClientErrorDetails } from "../interfaces/common.interface";
import { HttpStatus } from "./enums/http-status.enum";
import { HttpException } from "./http.exception";

export class UnprocessableEntityException extends HttpException {
    constructor(body: { details: ClientErrorDetails[] }) {
        super(body.details, HttpStatus.UNPROCESSABLE_ENTITY);
        this.message = "Unprocessable Entity Exception";
    }
}