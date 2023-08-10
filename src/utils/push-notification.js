import { Session } from '../modules/v1/user/models/session-model';
import { decrypt } from './encrypt';

const FCM = require('fcm-node');
const fcm = new FCM(process.env.FCM_SERVER_KEY);


class PushNotificationController {

    constructor() {
    }

    /**
     * @description  API create admin logs
     * @param {*} req 
     * @param {*} res 
     */

    async notification(id, data, type) {

        try {
            const sessions = await Session.find({ user_id: id })
            const myArray = []
            for (let i = 0; i < sessions.length; i++) {
                const session = JSON.parse(decrypt(sessions[i].session_token))
                if (session.device_information) {
                    myArray.push(session.device_information)
                }
                if (sessions.length - 1 === i) {
                    const unique = myArray.filter((obj, index, arr) => {
                        return arr.findIndex(t => t.device_token === obj.device_token) === index;
                    });

                    unique.map((notifi) => {
                        if (notifi.device_token) {
                            sendNotification(notifi.device_type, notifi.device_token, data._doc, type)
                        }
                    }
                    );
                }
            }
        }

        catch (err) {
            console.log(err);
        }

    }
}

export default new PushNotificationController();


/**
 * @description  API send notification
 * @param {*} req 
 * @param {*} res 
 */

const sendNotification = (deviceType, token, data, type) => {

    try {
        console.log('=========== PUSH NOTIFICATION START ============');
        let body = 'Message received';

        switch (Number(type)) {
            case 1:
                body = 'Your kyc details has been verified by admin';
                break;
            case 2:
                body = 'Your kyc details has been verified by admin';
                break;
            default:
                break;
        }

        const message = {
            to: token,
            content_available: true,
            priority: 'high',
        };

        if (deviceType === 'android') {
            message.data = data;
        }
        if (deviceType === 'IOS') {
            message.notification = {
                'title': 'FARMSENT',
                'body': body,
                'data': data,
                sound: 'default'
            };
        }
        console.dir(message);
        fcm.send(message, function (err, response) {
            if (err) {
                console.log('Something has gone wrong!', err);
            } else {
                console.log('Successfully sent with response: ', response);
            }
        })
    }

    catch (err) {
        console.log(err);
    }

}
