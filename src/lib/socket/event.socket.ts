import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const initEvents = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} is connected`);

        socket.on("stream", (data: any) => {
            console.log(data);
            io.emit('stream', data);
        })
    })
}