import dotenv from 'dotenv';
dotenv.config();

class Config {
    PORT = +process.env.PORT! || 8000;

    JWT_SECRET_KEY = process.env.JWT_SECRET_KEY! || "";

    NODE_ENV = process.env.NODE_ENV!;

    CELERY_ROUTER = {
        "crawl_price_queue": "worker.craw_price",
    }
    REDIS_URL = process.env.REDIS_URL!;
    COIN_MARKET_CAP_API = process.env.COIN_MARKET_CAP_API!;
    TIME_LIMIT = process.env.TIME_LIMIT! || 10800000;
}

export const config = new Config;