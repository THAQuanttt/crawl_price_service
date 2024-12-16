import lodash from "lodash";
import { createWorker } from "celery-node";

import { config } from "../../config/configuration";

export const getWorker = (queueName: string) => {
    if (!Object.keys(config.CELERY_ROUTER).includes(queueName))
        throw new Error("Queue not set up");
    const worker = createWorker(config.REDIS_URL, config.REDIS_URL, queueName);
    const taskName: string = lodash.get(config.CELERY_ROUTER, queueName);
    return { worker, taskName };
};
