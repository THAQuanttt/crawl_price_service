import { IToken } from "../services/cron/cron.interface";
import { config } from "../config/configuration";
export const isTokenExpired = (token: IToken): boolean => {
    // Chuyển datetime của token thành đối tượng Date
    const tokenTime = new Date(token.datetime);
    
    // Lấy thời gian hiện tại
    const currentTime = new Date();
    
    const timeDifference = currentTime.getTime() - tokenTime.getTime();
    console.log(timeDifference);
    return timeDifference < Number(config.CRON_TIME);
  };