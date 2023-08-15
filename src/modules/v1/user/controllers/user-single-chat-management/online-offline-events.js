import { helper } from "../../../../../utils/socket.io-helper";
import { EVENTS ,ONLINE_STATUS } from "../../events/chat-events";
import { ChatMessage } from "../../models/chat-message-model";
import moment from 'moment-timezone';
import { User } from "../../models/user-model";


export const onlineOffline = async (message) => {
    const lastSeen = (message.status == ONLINE_STATUS.ONLINE) ? ONLINE_STATUS.ONLINE : (moment().tz('Europe/London').unix() * 1000).toString();
    const data = { id: message.id, last_seen: lastSeen }
    const id = { id: data.id }
    console.log(data,"data")
    await updateUserDetails(data);
    const contacts = await getContactDetails(id)
    if (contacts.contacts) {
        if (contacts.contacts.length === 0) {
            //emited to sender
            helper.sendToSocketClients(message.id, EVENTS.ONLINE_OFFLINE, { _id: message.id });
        } else {
            contacts.contacts.forEach(async (contact) => {
                //emited to contacts of sender
                //store offline
                helper.sendToSocketClientsWithAck(contact._id, EVENTS.ONLINE_OFFLINE, { _id: message.id, last_seen: lastSeen });
            });
        }
    } else {
        console.log("no contacts to send online offline status")
    }
};



export const updateUserDetails = async (data) => {
    const update = await User.findByIdAndUpdate(data.id)
    return update.data
};

//get contacts details of a user from auth
export const getContactDetails = async (id) => {
    const user = await User.findById(id)
    return user.data
};