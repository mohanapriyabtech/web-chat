import { responseHandler } from "../../../../../utils/response-handler";
import { createSession, encrypt } from "../../../../../utils/encrypt";
import { User } from "../../models/user-model";
import mailContent from "../../../../../utils/mail-content";


class SignupController {

    constructor() {
    }

    /**
      * @description   api to user signup
      * @param {*} req /api/v1/user/signup
      * @param {*} res 
      */

    async create(req, res) {

        try {
            req.body.password = encrypt(req.body.password)
            const user = await User.create(req.body)
            if (user) {
                const session = await createSession(user);
                user.auth_token = await session.session_token
                await user.save()
                // await mailContent.verificationMail(updates)
                return responseHandler.successResponse(res, { user, session }, "user signup successfull", 200);
            } else {
                return responseHandler.errorResponse(res, {}, 'signup failed', 400);
            }

        }
        catch (err) {
            console.log(err)
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new SignupController();

