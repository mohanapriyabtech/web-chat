import { EVENTS , MESSAGE_STATUS} from "../../events/chat-events";
import { helper } from "../../../../../utils/socket.io-helper";
import { ChatMessage } from "../../models/chat-message-model";



export const messageDelivered = async (message) => {

    try {

      message.message_status = MESSAGE_STATUS.DELIVERED;
      helper.sendToSocketClients(message.sender, EVENTS.SINGLE_CHAT_DELIVERED, message);
      helper.sendToSocketClientsWithAck(message.receiver, EVENTS.SINGLE_CHAT_DELIVERED, message);
      await updateMessageStatus(message);

    } catch (error) {
      console.log('Exception on singleChatDelivered');
      console.error(error);
    }
};



// update Message Status
export const updateMessageStatus = async (data) => {
    try {
      const dbQuery = { message_id: { $in: data.message_id } };
      const updateQuery = { message_status: data.message_status };
      const updateStatus = await ChatMessage.updateMany(dbQuery, updateQuery).exec();
      console.log(`Updated ${updateStatus.nModified} messages to status ${data.message_status}`);
    } catch (error) {
      console.error('Error while updating message status:', error);
    }
};