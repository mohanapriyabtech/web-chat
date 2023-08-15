import { EVENTS , MESSAGE_STATUS} from "../../events/chat-events";
import { helper } from "../../../../../utils/socket.io-helper";
import { ChatMessage } from "../../models/chat-message-model";


export const singleChatRead = async (message) => {
    try {
        message.message_status = MESSAGE_STATUS.READ;
        console.log('read event params:', message);
    
        const senderPromise = helper.sendToSocketClients(message.sender, EVENTS.SINGLE_CHAT_READ, message);
        const receiverPromise = helper.sendToSocketClients(message.receiver, EVENTS.SINGLE_CHAT_READ, message);
    
        await Promise.all([senderPromise, receiverPromise]);
        await updateMessageStatus(message);
    
    } catch (error) {
        console.error('Exception on Single Chat Read');
        console.error(error);
    }
};


// update Message Status
export const updateMessageStatus = async (data) => {
    try {
      const dbQuery = { message_id: { $in: data.message_id } };
      const updateQuery = { message_status: data.message_status };
      const updateStatus = await ChatMessage.updateMany(dbQuery, updateQuery).exec();
      console.log(`Updated ${updateStatus.Modified} messages to status ${data.message_status}`);
    } catch (error) {
      console.error('Error while updating message status:', error);
    }
};
  
  
  
  
  
  
  
  
  
  