import { User } from "../../models/user-model";
import { EVENTS } from "../../events/chat-events";
import { helper } from "../../../../../utils/socket.io-helper";


export const addContact = async (message) => {  // sender -> initiate request ,receiver -> accept request

    try {
        const { sender, receiver } = message;

        if (sender && receiver) {
            const senderData = { sender, receiver };
            const receiverData = { sender: receiver, receiver: sender };

            const [user, viceVersa] = await Promise.all([
                updateContact(senderData),
                updateContact(receiverData)
            ]);

            if (user && viceVersa) {
                const contactSuccessMessage = {
                    status: true,
                    user: viceVersa
                };
                const senderSocketPromise = helper.sendToSocketClients(sender, EVENTS.ADD_CONTACT, contactSuccessMessage);
                const receiverSocketPromise = helper.sendToSocketClients(receiver, EVENTS.ADD_CONTACT, { ...contactSuccessMessage, user });
                await Promise.all([senderSocketPromise, receiverSocketPromise]);
            } else {
                throw new Error("Failed to update contacts");
            }
        } else {
            throw new Error("Invalid sender or receiver");
        }
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }

  };
  

export const updateContact = (message) => {
    return User.findOneAndUpdate({ _id:message.sender }, { $addToSet: { contacts: [message.receiver] } }, { new: true });
};