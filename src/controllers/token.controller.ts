import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import { executeGetPrice, getPrice } from "./token.service";
import { symbol } from "joi";

class TokensController {

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { symbol } = req.query;
            logger.info(`symbol: ${symbol}`)
            const price = await getPrice(symbol!.toString());
            return res.status(200).json({
                message:"Successfully get one price of token",
                data: price
            });
           
        } catch (error: any) {
            logger.error(error.message);
            next(error);
        }
    }

    // async executeCronjobs(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { symbol } = req.query;
    //         logger.info("Symbol: ", symbol)
            
    //         await executeGetPrice(symbol!.toString());

    //         return res.status(200).json({
    //             message:"Successfully set up to receive quotes from third party services"
    //         });
           
    //     } catch (error: any) {
    //         logger.error(error.message);
    //         next(error);
    //     }
    // }
}

export default new TokensController;
