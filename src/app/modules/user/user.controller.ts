import { RequestHandler } from 'express';
import sendResponse from '../../utils/sendResponse/sendResponse';
import { UserServices } from './user.service';

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

    sendResponse(res, result, 'Successfully followed');
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

    sendResponse(res, result, 'Successfully Unfollowed');
  } catch (error) {
    next(error);
  }
};

const getSingleUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getSingleUser(req.params.id);

    sendResponse(res, result, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getUserInfo: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getUserInfo(req.params.id);

    sendResponse(res, result, 'Status fetched successfully');
  } catch (error) {
    next(error);
  }
};

const becomePremiumMember: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.becomePremiumMember(req.body);

    sendResponse(res, result, 'Premium membership obtained successfully');
  } catch (error) {
    next(error);
  }
};

const paymentConfirmation: RequestHandler = async (req, res, next) => {
  try {
    const { transactionId } = req.query;

    const result = await UserServices.paymentConfirmation(
      transactionId as string,
    );

    sendResponse(res, result, 'Payment Confimation successfully');
  } catch (error) {
    next(error);
  }
};

const getAllUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getAllUser();

    sendResponse(res, result, 'Get All user successfully');
  } catch (error) {
    next(error);
  }
};

const blockUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.blockUser(req.params.id);

    sendResponse(res, result, 'Block user By Admin successfully');
  } catch (error) {
    next(error);
  }
};

const unblockUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.unblockUser(req.params.id);

   
    sendResponse(res, result, 'Unblock user By Admin successfully');
  } catch (error) {
    next(error);
  }
};

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.deleteUser(req.params.id);

    sendResponse(res, result, 'Admin Deleted successfully');
  } catch (error) {
    next(error);
  }
};

const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.createAdmin(req.body);

    res.send(result);
  } catch (error) {
    next(error);
  }
};

const getAllAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.getAllAdmin();

    res.send(result);
  } catch (error) {
    next(error);
  }
};

const updateAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.updateAdminProfile(
      req.params.userId,
      req.body,
    );

    res.send(result);
  } catch (error) {
    next(error);
  }
};

const deleteAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await UserServices.deleteAdmin(req.params.id);

    res.send(result);
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
  getUserInfo,
  becomePremiumMember,
  paymentConfirmation,
  getAllUser,
  blockUser,
  deleteUser,
  unblockUser,
  createAdmin,
  getAllAdmin,
  updateAdmin,
  deleteAdmin,
};