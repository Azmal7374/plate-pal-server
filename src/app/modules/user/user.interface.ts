import { ObjectId } from 'mongoose';

export type TUser = {
  email: string;
  password: string;
  name: string;
  role: string;
  profilePicture: string;
  bio: string;
  followers: ObjectId;
  following: ObjectId;
  recipes: ObjectId;
  premiumMembership: boolean;
};
