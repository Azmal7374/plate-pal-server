import { RequestHandler } from 'express';
import { AuthServices } from './auth.service';
import sendResponse from '../../utils/sendResponse/sendResponse';

const login: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.login(req.body);
    const { accessToken, userData } = result;

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User log in successfully',
      token: accessToken,
      data: userData,
    });
  } catch (error) {
    next(error);
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


export const AuthControllers = {
  login,
};