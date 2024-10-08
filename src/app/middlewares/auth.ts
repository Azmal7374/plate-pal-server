import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../modules/user/user.model';

const auth = (...roles: string[]): RequestHandler => {
  const authorize: RequestHandler = async (req, res, next) => {
    try {
      // Extracting the Token:
      const token = req.headers.authorization;

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'You must login first!',
        });
        return; // Early return to prevent further execution
      }

      // Token Format Validation:
      const tokenParts = token.split(' ');

      if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        res.status(401).json({
          success: false,
          message: 'Invalid token format',
        });
        return;
      }
      const accessToken = tokenParts[1];

      // Token Verification:
      const decoded = jwt.verify(
        accessToken,
        config.jwt_acess_token_secret as string,
      ) as JwtPayload;

      const { email, role } = decoded;

      // User Validation:
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'This user is not found!',
        });
        return;
      }

      // Role-based Authorization:
      if (roles.length > 0 && !roles.includes(role)) {
        res.status(403).json({
          success: false,
          message: 'You have no access to this route',
        });
        return;
      }

      // Attaching the User to the Request:
      req.user = decoded as JwtPayload;
      next(); // Proceed to the next middleware
    } catch (error) {
      next(error); // Pass any errors to the next error-handling middleware
    }
  };

  return authorize;
};


export default auth;
