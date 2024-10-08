import { RequestHandler } from 'express';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse/sendResponse';

const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.login(req.body);
    const { accessToken, userData } = result;

    // Sending the response without returning it
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User log in successfully',
      accessToken,
      data: userData,
    });
  } catch (error) {
    next(error);  // Forward the error to the next middleware
  }
};

const changePassword: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.changePassword(req.body);

    sendResponse(res, result, 'Change password Successfully');
  } catch (error) {
    next(error);
  }
};

const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const email = req.body.email;
    console.log(email);
    const result = await AuthServices.forgotPassword(email);

    sendResponse(res, result, 'Reset link is generated succesfully!');
  } catch (error) {
    next(error);
  }
};

export const AuthControllers = {
  login,
  changePassword,
  forgotPassword,
};
