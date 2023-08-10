/**
 * response handlers
 */

class ResponseHandler {

    successResponse = (res, data = {}, message = '', statusCode = 200) => {
        return res.status(statusCode).json({
            status_code: statusCode,
            status: true,
            message: message,
            data: data
        });
    }

    errorResponse = (res, error, message, statusCode) => {
        let params = {
            status_code: 500,
            status: false,
            message: error.message,
            data: {}
        }
        if (message) { params.message = message, params.status_code = 400 }
        if (statusCode) params.status_code = statusCode
        if (error.code == 11000) {
            params.status_code = 400
            params.message = `${Object.keys(error.keyValue)} already exists`
        }
        return res.status(params.status_code).json(params);
    }
}

export const responseHandler = new ResponseHandler();

