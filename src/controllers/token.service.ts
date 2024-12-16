import axios from "axios";

import { config } from "../config/configuration";
import { getCache, setCache } from "../utils/cache";
import logger from "../utils/logger";
import { cronService } from "../services/cron.service";
import { ICronService } from "../services/cron.interface";

class TokenService {
    constructor(private cronService: ICronService) {}
    
    // The getPrice function: used to get price of token (by symbol)
    // It will reset Timeout of cronjob and load price of token from cache (Redis)
    getPrice = async (symbol: string) => {
        let price = await getCache(`token:${symbol}`)
        if (!price)
        {
            price = await this.getPriceFromThirdPartyService(symbol);
        }
        this.cronService.startTask(symbol);
        return price;
    }
    
    // The getPriceFromThirdPartyService function: used to get price of token from CoinMarketCap
    // It will call CoinMarketCap's API and get price from the response data
    getPriceFromThirdPartyService = async (symbol: string) => {
        try {
            const url = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest';
            const response = await axios.get(url, {
                params: {
                    symbol: symbol,
                },
                headers: {
                    'X-CMC_PRO_API_KEY': config.COIN_MARKET_CAP_API,
                },
            });

            //  Get the response data
            const tokenData = Object.values(response.data.data)[0];

            // if it dont have data, set price is null
            if (tokenData && tokenData[0] && tokenData[0].quote  &&typeof tokenData[0].quote === 'object' && tokenData[0].quote.USD) {
                
                const price = tokenData[0].quote.USD.price;

                logger.info(tokenData[0].quote.USD.price);

                await setCache(`token:${symbol}`, price, Number(config.TIME_LIMIT)/1000);
                return price;
            } else {

                await setCache(`token:${symbol}`, "null", Number(config.TIME_LIMIT)/1000);
                logger.info('Price data not available in expected format');
                return "null";
            }
        }
        catch (error) {
            throw error
        }
    }
}

export const tokenService = new TokenService(cronService);