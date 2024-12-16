import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { tokenService } from "./token.service";

class TokensController {

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { symbol } = req.query as { symbol: string };
            const price = await tokenService.getPrice(symbol);
            return res.status(200).json({
                message:"Successfully get one price of token",
                data: price
            });
           
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }
}

export default new TokensController;
