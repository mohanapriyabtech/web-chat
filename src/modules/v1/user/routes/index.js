import express from 'express';
import signUpUser from '../controllers/user-management/sign-up-user';
import loginUser from '../controllers/user-management/login-user';
import updateUser from '../controllers/user-management/update-user';
import getUser from '../controllers/user-management/get-user';
import userValidator from '../validators/user-validator';
import paramsValidator from '../validators/params-validator';


const userRouter = express.Router();

/**
 * user routes
 * @description user routes
 */

//user routes
userRouter.post('/signup', userValidator.signup, signUpUser.create);
userRouter.post('/login', userValidator.login, loginUser.get);
userRouter.patch('/update/:id', paramsValidator.validate, userValidator.update, updateUser.update);
userRouter.get('/details/:id', paramsValidator.validate, getUser.get);

module.exports = userRouter;