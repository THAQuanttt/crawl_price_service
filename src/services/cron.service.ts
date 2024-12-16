// cronService.ts
import cron from 'node-cron';
import { tokenService } from '../controllers/token.service';
import { config } from '../config/configuration';
import logger from '../utils/logger';
import { getWorker } from '../infrastructures/tasks/worker';
import { ICronService } from "./cron.interface";

const { taskName, client } = getWorker("crawl_price_queue");class CronService implements ICronService {
    private readonly task = client.createTask(taskName);
    private cronJob: cron.ScheduledTask | null = null; // Để lưu trạng thái của cron job

    startTask(symbol: string) {
        // Nếu cron job chưa được tạo thì mới tạo mới
        if (!this.cronJob) {
            // Run in first start
            (async () => {
                try {
                    await tokenService.getPriceFromThirdPartyService(symbol);
                } catch (error) {
                    logger.error('Error fetching token price:', error);
                }
            })();

            // Tạo cron job mới chỉ một lần duy nhất
            this.cronJob = cron.schedule('* * * * *', async () => {
                try {
                    await tokenService.getPriceFromThirdPartyService(symbol);
                    this.task.applyAsync([symbol]);
                } catch (error) {
                    logger.error('Error while executing cron task:', error);
                }
            });

            logger.info('Task started');
        } else {
            
            logger.info('Cron job is already running.');
        }
    }

    stopTask() {
        if (this.cronJob) {
            this.cronJob.stop(); // Dừng cron job nếu cần
            this.cronJob = null;
            logger.info('Cron job stopped.');
        }
    }
}


export const cronService = new CronService();