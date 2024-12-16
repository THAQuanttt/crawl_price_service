
export interface ICronService {
    startTask(symbol: string): void;
    stopTask() : void;
    sendTask() : void;
}

export interface IToken {
    symbol: string;  
    datetime: string; 
  }