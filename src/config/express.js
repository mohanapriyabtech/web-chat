import cors from 'cors';
import xss from 'xss-clean';
import express from 'express';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit'

/**
 * cors middleware options
 * @param {*} req 
 * @param {*} callback 
 */
const corsOptions = {
    origin: function (origin, callback) {
        if (process.env.WHITE_LISTED_DOMAINS.split(',').indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
};

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // Limit each IP to 100 requests per `window` (here, per 1 minute)
    // message:'Too many accounts created from this IP, please try again after an hour',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


export default class Express {

    constructor() {
        this.express = express;
        this.app = new express();
        // sanitize request data
        this.app.use(xss());
        this.app.use(cors(corsOptions));
        // parse urlencoded request body
        this.app.use(this.express.urlencoded({ limit: '50mb', extended: true }));
        // parse response body
        this.app.use(this.express.json({ limit: '50mb' }));
        // to handle uploading files
        this.app.use(fileUpload({
            createParentPath: true,
        }));
        this.app.use(limiter)
        // error handling middleware
        this.app.use(function (err, req, res, next) {
            if (err.message === 'Not allowed by CORS') {
                res.status(403).json({
                    status: false,
                    statusCode: 403,
                    message: 'please visit our official website'
                })
            } else {
                next(err);
            }
        });
    }
}

