// cronService.ts
import cron from 'node-cron';
import { getPriceFromThirdPartyService } from '../controllers/token.service';
import { config } from '../config/configuration';
import logger from '../utils/logger';
interface CronJob {
    task: cron.ScheduledTask;
    stopTimeout: NodeJS.Timeout;
}
// This is CronService used to create a conjob to get price of token (pass with symbol of token)
// It include:
// - jobs: a map cronjobs are running, each element includes a symbol and a Crobjob (task and stopTimeout)
// - startTask function: the function is used a create a Cronjob, it will stop the current Cronjob of symbol and start a new Cronjob
// - stopTask function: the function is used to stop a Cronjob, it will check if cronjob is running, stop this cropjob and remove cronjob from map jobs.
// - checkRunning function: The function is used to check the Cronjob is running or not.
// - restartTimeRunning  function: The function is used to reset the stop time of a cronjob, by overriding new stop time (stopTimeout)
class CronService {
    private jobs: Map<string, CronJob> = new Map();

    startTask(symbol: string) {

        this.stopTask(symbol);

        // Run in first start
        (async () => {
            try {
                await getPriceFromThirdPartyService(symbol);
            } catch (error) {
            }
        })();

        //  start a cron job (* * * * is repeat every minute)
        const task = cron.schedule('* * * * *', async () => {
            //  call this function to get a price of token (by symbol)
            await getPriceFromThirdPartyService(symbol);
        });

        // Setup the stop time for this cron job
        const stopTimeout = setTimeout(() => {
            this.stopTask(symbol);
            console.log(`Task stopped after ${config.TIME_LIMIT} minutes`);
        }, Number(config.TIME_LIMIT));
        // push symbol and cronjob to map jobs
        this.jobs.set(symbol, { task, stopTimeout });

        console.log('Task started');
    }

    stopTask(symbol: string) {
        // Get cronjob by symbol
        const job = this.jobs.get(symbol);
        // if it is running, stop the cronjob
        if (job) {
            job.task.stop();
            clearTimeout(job.stopTimeout);
            // remove it from map jobs
            this.jobs.delete(symbol);
            console.log(`Task for ${symbol} stopped`);
        }
    }
    // check the cronjob is running
    checkRunning(symbol: string){
        const job = this.jobs.get(symbol)
        return job ? true: false;
    }

    // reset a the stop time of cronjob
    restartTimeRunning(symbol:string)
    {
        // get cronjob
        const job= this.jobs.get(symbol);

        if(job)
        {
            // clear current timeOut of cronjob
            const timeOut= job.stopTimeout;
            clearTimeout(timeOut);
            // create new timeOut
            job.stopTimeout =setTimeout(() => {
                this.stopTask(symbol);
                console.log(`Task stopped after ${config.TIME_LIMIT} minutes`);
            }, Number(config.TIME_LIMIT));
        }
        else
        {
            // if it is not running, start a new cronjob
            this.startTask(symbol);
        }
        
        logger.info(`Reset time of ${symbol}`)
    }
}

export const cronService = new CronService();