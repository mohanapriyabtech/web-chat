import { EVENTS , MESSAGE_STATUS} from "../../events/chat-events";
import { helper } from "../../../../../utils/socket.io-helper";
import { ChatMessage } from "../../models/chat-message-model";



export const singleChatMessage = async (message, callback) => {
    try {
        if (typeof message !== 'object') console.log(`Single chat received with unsupported data format: ${typeof message}`);
        const senderInfo = await User.findById(message.sender).catch(console.error);
        if (!senderInfo) console.log(`Sender not found for id: ${message.sender}`);

        if (message.check_blocked_by_user === true) {
            message.message_status = MESSAGE_STATUS.SENT;
            helper.sendToSocketClients(message.sender, EVENTS.SINGLE_CHAT_SEND_MESSAGE, message, 0);
            return;
        }

        message.event = EVENTS.SINGLE_CHAT_SEND_MESSAGE;
        message.message_status = MESSAGE_STATUS.SENT;

        const saveResponse = await storeChat(message);

        message.created_at = saveResponse.created_at;
        helper.sendToSocketClients(message.sender, message.event, message);
        helper.sendToSocketClients(message.receiver, message.event, message);
        sendChatNotification(message);

    } catch (error) {
        console.error('Exception on single chat');
        console.error(error);
    }
};


export const storeChat = async (query) => {
    try {
      const chat = new ChatMessage(query);
      const result = await chat.save();
      return result;
    } catch (error) {
      console.error('Exception on storechat: ', error);
      throw error;
    }
};