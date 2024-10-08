import express from 'express';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.login,
);

router.post(
  '/change-password',
  auth('user', 'admin'),
  AuthControllers.changePassword,
);

router.post('/forgot-password', AuthControllers.forgotPassword);



// Handle form submission for password reset

export const AuthRoutes = router;
