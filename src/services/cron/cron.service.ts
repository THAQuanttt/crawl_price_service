// cronService.ts
import cron from 'node-cron';

import { tokenService } from '../../controllers/token.service';
import logger from '../../utils/logger';
import { getWorker } from '../../infrastructures/tasks/worker';
import { ICronService, IToken } from "./cron.interface";
import { isTokenExpired } from "../../utils/validate-token"
const { taskName, client } = getWorker("crawl_price_queue");

class CronService implements ICronService {
    private readonly task = client.createTask(taskName);
    private tokens: { [symbol: string]: IToken } = {};
    // save state of cron job
    private cronJob: cron.ScheduledTask | null = null; 
    
    startTask(symbol: string) {
        const newToken: IToken = {
            symbol,
            datetime: new Date().toISOString(),
        };
        this.tokens[symbol] = newToken;
        // If the cron job has not been created, create a new one.
        if (!this.cronJob) {
            this.cronJob = cron.schedule('* * * * *', () => {
                this.sendTask();
            });
            logger.info('Task started');
        } else {
            logger.info('Cron job is already running.');
        }
    }

    stopTask() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
            logger.info('Cron job stopped.');
        }
    }
    sendTask(){
        try {
            let isStopCron = true;

            Object.keys(this.tokens).forEach(symbol => {
                const token = this.tokens[symbol];
                if(isTokenExpired(token))
                {
                    (async () => {
                        try {
                            this.task.applyAsync([token.symbol])
                            logger.info("Send task")
                        } catch (error) {
                          logger.error('Failed to send task:', error);
                        }
                      })();
                  
                    isStopCron = false
                }
                else
                {
                    delete this.tokens[token.symbol];
                }
              });
            
            if(isStopCron)
            {
                logger.warn("Stop Cron");
                this.stopTask();
            }
        } catch (error) {
            logger.error('Error while executing cron task:', error);
        }
    }
}


export const cronService = new CronService();