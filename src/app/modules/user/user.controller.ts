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

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.updateProfile(req.params.id, req.body);

    sendResponse(res, result, 'Profile updated succesfully');
  } catch (error) {
    next(error);
  }
};

const followUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.addToFollowing(req.params.id, req.user);

    sendResponse(res, result, 'You Successfully Follow');
  } catch (error) {
    next(error);
  }
};

const unfollowUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.removeFromFollowing(
      req.params.id,
      req.user,
    );

    sendResponse(res, result, 'You Successfully Unfollow');
  } catch (error) {
    next(error);
  }
};

const getSingleUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getSingleUser(req.params.id);

    sendResponse(res, result, 'Single User fetched successfully');
  } catch (error) {
    next(error);
  }
};


export const UserControllers = {
  createUser,
  updateUser,
  followUser,
  unfollowUser,
  getSingleUser,
};