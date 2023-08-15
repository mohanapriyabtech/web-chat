import { User } from "../../models/user-model";
import { EVENTS } from "../../events/chat-events";
import { helper } from "../../../../../utils/socket.io-helper";


export const messageTyping = async (message) => {
    console.log(message,"ms")

    try {
        if (typeof message === 'object') {
            const receiverClients = helper.clients.get(message.receiver)
            console.log(receiverClients)
            
            if (receiverClients && receiverClients.length > 0) {
                helper.sendToSocketClients(message.receiver, EVENTS.SINGLE_CHAT_TYPING, message);
            }
        } else {
            console.log(`Typing event received with unsupported data format: ${typeof message}`);
        }
    } catch (error) {
        console.error('Exception on typing:', error.message);
        throw new Error(`Error while handling typing event: ${error.message}`);
    }
}