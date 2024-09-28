import express from 'express';
import { UserControllers } from './user.controller';
import { validateUserSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(validateUserSchema.userRegistrationValidation),
  UserControllers.createUser,
);

export const UserRoutes = router;
