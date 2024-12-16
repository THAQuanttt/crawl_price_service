import axios from "axios";

import { getWorker } from "./worker";
import logger from "../../utils/logger";
import { cronService } from "../../services/cron.service";

const { taskName, worker } = getWorker("crawl_price_queue");

worker.register(
  taskName,
  async (symbol: string) => {
    logger.info("execute task");
    try {
        cronService.startTask(symbol);
      } 
    catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Error fetching token price:', error.response?.data || error.message);
      } else {
        logger.error('An unexpected error occurred:', error);
      }
      return "Error";
    }

    return "success";

  },
);


export default worker.start();
