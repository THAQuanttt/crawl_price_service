import Bull from 'bull';
import { instanceToPlain } from 'class-transformer';

type JobOptions = {
    attempts: number;
    backoff: {
        type: 'fixed' | 'exponential';
        delay: number;
    };
    removeOnComplete: boolean;
    removeOnFail: boolean;
}

export class BullService {
    private readonly jobOptions: JobOptions;
    private readonly concurrency: number;
    constructor(private queue: Bull.Queue, private processor?: Bull.ProcessCallbackFunction<any>) {
        this.jobOptions = {
            attempts: 5,
            backoff: {
                type: 'fixed',
                delay: 1000
            },
            removeOnComplete: true,
            removeOnFail: true
        }
        this.concurrency = 5;

        if (processor)
            queue.process(queue.name, this.concurrency, processor);

        queue.on('completed', (job, result) => {
            console.log(`on completed: ${result}`);
        })
    }

    async addTask(taskData: any) {
        await this.queue.add(this.queue.name, taskData, this.jobOptions);
    }
}

const processor = async (job: Bull.Job<any>, done: Bull.DoneCallback) => {
    try {
        console.log('Processing task:', job.id);
        console.log('Processed data:', job.data);
        done();
    } catch (error: any) {
        console.error('Error processing task:', error);
    }
}
const queueService = new BullService(new Bull('test', 'redis://localhost:6379'));


queueService.addTask({ data: 'oke' });