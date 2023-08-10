import { responseHandler } from "../../../../../utils/response-handler";
import { createSession, decrypt } from "../../../../../utils/encrypt";
import { User } from "../../models/user-model";


class LoginController {

    constructor() {
    }

    /**
      * @description   api to user login
      * @param {*} req /api/v1/user/login
      * @param {*} res 
      */

    async get(req, res) {

        try {
            const user = await User.findOne({ email: req.body.email })
            if (user) {
                if (decrypt(user.password) === req.body.password) {
                    if (user.status == 0) {
                        return responseHandler.errorResponse(res, {}, "You have been blocked by admin", 400);
                    } else {
                        const session = await createSession(user);
                        user.auth_token = await session.session_token
                        await user.save()
                        return responseHandler.successResponse(res, { user, session }, "User logged in successfull", 200);
                    }
                } else {
                    return responseHandler.errorResponse(res, {}, "Password wrong , try again", 400);
                }
            } else {
                return responseHandler.errorResponse(res, {}, "No user exist with this email", 400);
            }
        }
        catch (err) {
            return responseHandler.errorResponse(res, err);
        }

    }
}

export default new LoginController();

