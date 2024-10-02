import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import UserModel from './user.model';
import RecipeModel from '../recipe/recipe.model';
import { initiatePayment, verifyPayment } from '../../utils/PaymentGateWay/PaymentGateway';


const createUser = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('User already exists!');
  }

  const result = await UserModel.create(payload);
  return result;
};

const getSingleUser = async (id: string) => {
  const userData = await UserModel.findById(id);
  const userPostedRecipeData = await RecipeModel.find({ user: id });

  return { userData, userPostedRecipeData };
};

const getUserInfo = async (id: string) => {
  const userData = await UserModel.findById(id);

  return userData;
};

const updateProfile = async (userId: string, updateData: Partial<TUser>) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  if (updateData.email) {
    const existingUser = await UserModel.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Email already in use!');
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  return updatedUser;
};

const addToFollowing = async (id: string, user: JwtPayload) => {
  const currentUser = await UserModel.findById(user.userId);

  if (!currentUser) {
    throw new Error('Current user not found!');
  }

  if (currentUser.following.includes(id)) {
    throw new Error('You are already following this user.');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $addToSet: { following: id },
    },
    { new: true }, 
  );

  if (!updatedUser) {
    throw new Error('Failed to update following list.');
  }

  await UserModel.findByIdAndUpdate(id, {
    $addToSet: { followers: user.userId },
  });

  return updatedUser;
};

const removeFromFollowing = async (id: string, user: JwtPayload) => {
  const currentUser = await UserModel.findById(user.userId);

  if (!currentUser) {
    throw new Error('Current user not found!');
  }

  if (!currentUser.following.includes(id)) {
    throw new Error('You are not following this user.');
  }

  const updatedUser = await UserModel.findByIdAndUpdate(
    user.userId,
    {
      $pull: { following: id },
    },
    { new: true }, 
  );

  if (!updatedUser) {
    throw new Error('Failed to update following list.');
  }

  await UserModel.findByIdAndUpdate(id, {
    $pull: { followers: user.userId },
  });

  return updatedUser;
};



const getAllUser = async () => {
  const userData = await UserModel.find({ role: 'user' });
  return userData;
};

const blockUser = async (id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { isBlocked: true },
    { new: true },
  );

  return user;
};

const unblockUser = async (id: string) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { isBlocked: false },
    { new: true },
  );

  return user;
};

const deleteUser = async (id: string) => {
  await RecipeModel.deleteMany({ user: id });

  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

const createAdmin = async (payload: TUser) => {
  const isUserAlreadyExists = await UserModel.findOne({ email: payload.email });

  if (isUserAlreadyExists) {
    throw new Error('Admin already exists!');
  }

  payload.role = 'admin';

  const result = await UserModel.create(payload);

  return result;
};

const getAllAdmin = async () => {
  const result = await UserModel.find({ role: 'admin' });

  return result;
};

const updateAdminProfile = async (
  userId: string,
  updateData: Partial<TUser>,
) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found!');
  }

  // If email is being updated, ensure it's unique
  if (updateData.email) {
    const existingUser = await UserModel.findOne({ email: updateData.email });
    if (existingUser && existingUser._id.toString() !== userId) {
      throw new Error('Email already in use!');
    }
  }

  const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, {
    new: true,
  });

  return updatedUser;
};

const deleteAdmin = async (id: string) => {
  const user = await UserModel.findByIdAndDelete(id);

  return user;
};

export const UserServices = {
  createUser,
  updateProfile,
  addToFollowing,
  removeFromFollowing,
  getSingleUser,
  getUserInfo,
  becomePremiumMember,
  paymentConfirmation,
  getAllUser,
  blockUser,
  unblockUser,
  deleteUser,
  createAdmin,
  getAllAdmin,
  updateAdminProfile,
  deleteAdmin,
};