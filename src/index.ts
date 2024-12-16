import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { config } from './config/configuration';
import initRoutes from './routes';
import { initSocketIO } from './lib/socket/gateway.socket';
import "./infrastructures/tasks/index"
import { initRedis } from './shared/redis/redis.service';
import logger from './utils/logger';

const app = express();

app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

initRoutes(app);
// connect redis
(async () => {
    try {
      await initRedis();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
    }
  })();

const { server } = initSocketIO(app);

server.listen(config.PORT, (() => {
    console.log(`🚀 Server is running on http://localhost:${config.PORT}`);
}))