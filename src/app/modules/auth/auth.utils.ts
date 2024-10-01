import jwt,{ JwtPayload } from 'jsonwebtoken';
export const createToken =(
    JwtPayload:JwtPayload,
    secret:string,
    expiresIn:string,
) => {
    return jwt.sign(JwtPayload,secret,{
        expiresIn,
    });
};