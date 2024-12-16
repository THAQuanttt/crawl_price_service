import http from 'http';
import { Server } from 'socket.io';
import { Express, NextFunction, Response } from 'express';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { initEvents } from './event.socket';

export let server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
export let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;

export const initSocketIO = (app: Express) => {
    server = http.createServer(app);
    io = new Server(server, {
        cors: { origin: '*' }
    });

    app.use((req: any, _res: Response, next: NextFunction) => {
        req.io = io;
        next();
    });

    initEvents(io);

    return { server, io }
}