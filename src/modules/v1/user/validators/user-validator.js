import Joi from 'joi';
import { responseHandler } from '../../../../utils/response-handler';

Joi.objectId = require('joi-objectid')(Joi);

class UserValidator {
    constructor() {
        this.schemas = {
            signup: Joi.object({
                name: Joi.string().required().error(new Error("Name is required")),
                email: Joi.string()
                    .required()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                    .error(new Error("Email is required")),
                phone_number: Joi.string()
                    .pattern(/^\+?[0-9\s]+$/)
                    .min(4)
                    .max(15)
                    .messages({
                        'string.pattern.base': 'Phone number must only contain digits',
                        "string.min": "Phone number must be minimum 4 digit number",
                        "string.max": "Phone number must be maximum 15 digit number"
                    }),
                password: Joi.string().required().error(new Error("Password is required")),
                auth_token: Joi.string(),
                profile_picture:Joi.string().required().error(new Error("Profile picture is required")),
            }),

            login: Joi.object({
                email: Joi.string().required().error(new Error("Email is required")),
                password: Joi.string().required().error(new Error("Password is required")),
            }),

            update: Joi.object({
                name: Joi.string().error(new Error("Enter a valid name")),
                email: Joi.string()
                    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
                    .required()
                    .error(new Error("Enter a valid email")),
                phone_number: Joi.string()
                    .pattern(/^\+?[0-9\s]+$/)
                    .min(4)
                    .max(15)
                    .required()
                    .messages({
                        'string.pattern.base': 'Phone number must only contain digits',
                        "string.min": "Phone number must be minimum 4 digit number",
                        "string.max": "Phone number must be maximum 15 digit number",
                        "any.required": "Phone number is required"
                    }),
                
            }),
        };
    }

    validateAndNext = (schemaName) => (req, res, next) => {
        const schema = this.schemas[schemaName];
        try {
            const { error } = schema.validate(req.body);
            if (!error) {
                next();
            } else {
                const errorMessage = error.message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
                return responseHandler.errorResponse(res, {}, errorMessage, 400);
            }
        } catch (err) {
            console.error(err);
            responseHandler.errorResponse(res, err);
        }
    };

    signup = this.validateAndNext('signup');
    login = this.validateAndNext('login');
    update = this.validateAndNext('update');
}

export default new UserValidator();
