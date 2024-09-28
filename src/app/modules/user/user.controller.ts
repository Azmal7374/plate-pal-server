import { RequestHandler } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse/sendResponse';

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.createUser(req.body);

    sendResponse(res, result, 'User has been created succesfully');
  } catch (error) {
    next(error);
  }
};

export const UserControllers = {
  createUser,
};
