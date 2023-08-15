import { helper } from "../../../../../utils/socket.io-helper";
import { EVENTS } from "../../events/chat-events";
import { ChatMessage } from "../../models/chat-message-model";




export const lastMessage = async (data) => {
    try {
        if (data) {
            const chats = await getAllChat(data);
            if (chats.data.length > 0) {
                helper.sendToSocketClients(data.sender, EVENTS.LAST_MESSAGE, chats.data[0]);
            }
        } else {
            console.log("no sender");
        }
    } catch (error) {
        console.error('Exception on last message');
        console.error(error);
    }
};




export const getAllChat = async (users) => {
    const dbQuery = {
        $or: [
            { receiver: users.sender, sender: users.receiver },
            { receiver: users.receiver, sender: users.sender }
        ]
    };

    const options = {
        page: users.page || 0,
        limit: users.limit !== undefined && users.limit !== '0' ? users.limit : 50,
        sort: { created_at: -1 }
    };

    try {
        const chatList = await ChatMessage.paginate(dbQuery, options);
        return {
            data: chatList.docs,
            total: chatList.totalDocs,
            meta: {
                limit: chatList.limit,
                total_pages: chatList.totalPages,
                current_page: chatList.page,
                paging_counter: chatList.pagingCounter,
                has_previous_page: chatList.hasPrevPage,
                has_next_page: chatList.hasNextPage,
                previous_page: chatList.prevPage,
                next_page: chatList.nextPage,
                options: options
            }
        };
    } catch (exception) {
        console.error(exception);
        throw exception;
    }
};