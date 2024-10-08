import { JwtPayload } from 'jsonwebtoken';
import UserModel from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './auth.utils';
import { sendEmail } from '../../utils/SendEmail/sendEmail';

const login = async (payload: TLoginUser) => {
  const user = await UserModel.findOne({ email: payload.email }).select(
    '+password',
  );

  //  Handling the Case Where the User is Not Found
  if (!user) {
    throw new Error('User not found!!');
  }

  //   Password Verification
  const matchPassword = await bcrypt.compare(
    payload.password,
    user.password as string,
  );

  //  Handling Wrong Password
  if (!matchPassword) {
    throw new Error('Wrong password!! Please try again.');
  }

  //   Creating the JWT Payload
  const JwtPayload: JwtPayload = {
    email: user.email,
    role: user.role,
    premiumMembership: user.premiumMembership,
    userId: user._id,
    profilePicture: user.profilePicture,
    name: user.name,
  };

  //  Generating the JWT Access Token
  const accessToken = createToken(
    JwtPayload,
    config.jwt_acess_token_secret as string,
    config.access_token_expires_in as string,
  );

  //  Fetching User Data Again
  const userData = await UserModel.findOne({
    email: payload.email,
  });

  // Return the Access Token and User Data
  return {
    accessToken,
    userData,
  };
};

const changePassword = async (payload: {
  email: string;
  password: string;
  newPassword: string;
}) => {
  //find user by email
  const user = await UserModel.findOne({ email: payload.email });
  //   console.log(payload)
  //check used matched
  if (!user) {
    throw new Error('User not found');
  }

  // Compare old password
  const matchPass = await bcrypt.compare(payload.password, user.password);
  // Throw error if old password doesn't match
  if (!matchPass) {
    throw new Error('Password mismatch');
  }

  // Hash the new password
  const newhasPass = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  // Update the user's password in the database
  await UserModel.findOneAndUpdate(
    {
      email: payload.email,
    },
    {
      password: newhasPass,
    },
  );
};

//  const refreshToken = async (token: string) => {

//  };

const forgotPassword = async (email: string) => {
   const user = await UserModel.findOne({ email: email });
 
   if (!user) {
     throw new Error('You are not a registered user yet!');
   }
 
   const jwtPayload = {
     userEmail: user?.email,
     role: user?.role,
   };
 
   const resetToken = createToken(
     jwtPayload,
     config.jwt_acess_token_secret as string,
     '10m',
   );
 
   const resetUILink = `${config.reset_pass_ui_link}?email=${user?.email}&token=${resetToken} `;
 
   await sendEmail(user?.email as string, resetUILink);
 };

 
export const AuthServices = {
  login,
  changePassword,
  forgotPassword,
};
