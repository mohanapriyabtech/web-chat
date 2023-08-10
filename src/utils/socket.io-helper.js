
import { Session } from "../modules/v1/user/models/session-model";
import { User } from "../modules/v1/user/models/user-model";

/**
 * helper class for chat
 */
class ChatHelper {
    clients = new Map();
    userDetails = [];

    constructor() { }

    addClient(socket) {
        const { id: clientId } = socket.handshake.query;

        if (!this.clients.has(clientId)) {
            this.clients.set(clientId, []);
        }

        this.clients.get(clientId).push({ id: socket.id, socket: socket });

        this.logClientTable(); // Call the method here to log the updated client list
    }


    removeClientById(id, socketId) {
        if (this.clients.has(id)) {
            let clientSet = this.clients.get(id);
            clientSet = clientSet.filter(client => client.id !== socketId);

            if (clientSet.length === 0) {
                this.clients.delete(id);
            } else {
                this.clients.set(id, clientSet);
            }

            console.log(`Client removed: ${id}`);
            this.logClientTable();

            return clientSet;
        }
    }

    logClientTable() {
        const table = [];
        this.clients.forEach((clientSet, clientId) => {
            table.push({ ID: clientId, Sockets: clientSet.map(client => client.id).join(', ') });
        });

        console.table(table);
    }


    async sendToSocketClient(receiver, event, message) {
        console.log('Sending event:', event);
        console.log('Receiver:', receiver);
        console.log('Message:', message);

        const clientsArray = this.clients.get(receiver);

        if (clientsArray !== undefined && clientsArray.length !== 0) {
            for (const client of clientsArray) {
                const { socket } = client;
                if (socket !== undefined) {
                    console.log(`Emitting event "${event}" to user with ID: ${receiver}`);
                    try {
                        socket.emit(event, message);
                    } catch (error) {
                        console.error(`Error emitting event: ${error}`);
                    }
                }
            }
        }
    }




    sendToSocketClients(receiver, event, message) {
        if (typeof receiver === 'string') {
            this.sendToSocketClient(receiver, event, message);
        } else if (Array.isArray(receiver)) {
            for (const clientId of receiver) {
                this.sendToSocketClient(clientId.toString(), event, message); // Convert ObjectId to string
            }
        } else {
            console.log('Invalid receiver parameter:', receiver);
        }
    }


    async checkAuthentication(token, id) {
        const [checkMember] = await Promise.all([
            User.findById(id)
        ]);

        if (!checkMember ) { //&& !checkAdmin
            console.log('not a user');
            return false;
        }

        const session = await Session.findOne({ session_token: token, status: 1 }).exec();

        if (!session) {
            console.log('session not found');
            return false;
        }

        if (session.user_id != id) {
            console.log('user id mismatch');
            return false;
        }

        return true;
    }
}

export const helper = new ChatHelper();


