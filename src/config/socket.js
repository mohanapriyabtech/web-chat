import socketIO from "socket.io"
import { helper } from "../utils/socket.io-helper";
import { EVENTS } from "./../modules/v1/user/events/chat-events"
import { addContact } from "../modules/v1/user/controllers/user-single-chat-management/add-contact";
import { messageTyping } from "../modules/v1/user/controllers/user-single-chat-management/single-chat-typing";
import { singleChatMessage } from "../modules/v1/user/controllers/user-single-chat-management/single-chat-message";
import { singleChatRead } from "../modules/v1/user/controllers/user-single-chat-management/single-chat-read";
import { messageDelivered } from "../modules/v1/user/controllers/user-single-chat-management/single-chat-delivered";
import { lastMessage } from "../modules/v1/user/controllers/user-single-chat-management/last-message";
import { onlineOffline } from "../modules/v1/user/controllers/user-single-chat-management/online-offline-events";


export default class SocketConfig {

    constructor(server) {
        const socketParams = {
            cors: {
                origin: process.env.WHITE_LISTED_DOMAINS ? process.env.WHITE_LISTED_DOMAINS.split(',') : '*',
                methods: ["GET", "POST"],
            },
            transports: ['websocket', 'polling'],
        }
        this.socket = socketIO(server, socketParams);
    }

    /**
     * @param {*} socket 
     */

    async onConnection(socket) {
        console.log('new connection')
        const checkAuth = await helper.checkAuthentication(socket.handshake.query.Authorization, socket.handshake.query.id)
        if (socket.handshake.query.id == 'null' || socket.handshake.query.id === '' || socket.handshake.query.id === undefined || !checkAuth) {
            socket.disconnect()
            console.log(`connection failed socket id ${socket.id}`)
        } else {
            //add to client array
            helper.addClient(socket);

            console.log("A user has logged in on " + socket.handshake.query.id);  
            

            //listner functions
            eventHandler(socket)
            // check on disconnected(socket);
            socket.on(EVENTS.DISCONNECT, (reason) => {
                helper.removeClientById(socket.handshake.query.id, socket.id);
                //display client after disconnect
                console.log(
                    `a user disconneted ${socket.handshake.query.id} with socket id ${socket.id} due to ${reason}`
                );
            });
        }
    };
}




export const eventHandler = (socket) => {

    socket.on("ping", () => {
        helper.sendToSocketClients(socket.handshake.query.id, 'PING', { message: 'pong' })

    })
    socket.on(EVENTS.ADD_CONTACT, addContact);

    socket.on(EVENTS.SINGLE_CHAT_SEND_MESSAGE, singleChatMessage);
    socket.on(EVENTS.SINGLE_CHAT_TYPING, messageTyping);
    socket.on(EVENTS.SINGLE_CHAT_DELIVERED, messageDelivered);
    socket.on(EVENTS.SINGLE_CHAT_READ, singleChatRead);

    socket.on(EVENTS.LAST_MESSAGE, lastMessage);
   
    socket.on(EVENTS.ONLINE_OFFLINE, onlineOffline);

        

}
