import { responseHandler } from "../../../../utils/response-handler";
import { Session } from "../../user/models/session-model";
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from "../models/user-model";

class UserAuthentication {
    constructor() {
        this.secretKey = process.env.SECRET_KEY;

        // Configure Passport to use JWT strategy
        const opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: this.secretKey,
        };

        passport.use('user-jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
            try {
                const user = await User.findById(jwtPayload.id);
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                    // or you could create a new account
                }
            } catch (err) {
                return done(err, false);
            }
        }));
    }

    async check(req, res, next) {
        const token = req.headers.authorization
        const session = await Session.findOne({ session_token: token.split(' ')[1], status: 1 }).exec();

        if (!session) {
            return responseHandler.errorResponse(res, {}, "Invalid or expired session token", 401);
        }
        passport.authenticate('user-jwt', { session: false }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return responseHandler.errorResponse(res, {}, 'authentication failed', 401);
            }

            req.user = user;
            next();
        })(req, res, next);
    }
}

export default new UserAuthentication();
