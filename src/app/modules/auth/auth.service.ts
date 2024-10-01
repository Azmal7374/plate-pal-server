import { JwtPayload } from 'jsonwebtoken';
import UserModel from "../user/user.model"
import { TLoginUser } from "./auth.interface"
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './auth.utils';

const login = async(payload:TLoginUser) => {
    const user = await UserModel.findOne({email: payload.email}).select('+password',
 )

 if (!user) {
    throw new Error("User not found!!")
 }

 const matchPassword = await bcrypt.compare(
    payload.password,
    user.password as string,
 );

 if(!matchPassword) {
    throw new Error("Wrong password!! Please try again.");
 }

 const JwtPayload:JwtPayload = {
     email: user.email,
     role: user.role,
     premiumMembership: user.premiumMembership,
     userId: user._id,
     profilePicture: user.profilePicture,
     name: user.name,
 }

 const accessToken = createToken(
    JwtPayload,
    config.jwt_acess_token_secret as string,
    config.access_token_expires_in as string,
 );

 const userData = await  UserModel.findOne({ 
    email:payload.email,
 })


 return {
    accessToken,
    userData
 };
};

export const AuthServices ={
    login,
}