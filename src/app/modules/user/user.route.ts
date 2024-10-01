import express from 'express';
import { UserControllers } from './user.controller';
import { validateUserSchema } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/create-user',
  validateRequest(validateUserSchema.userRegistrationValidation),
  UserControllers.createUser,
);

router.put(
  '/update-user/:id',
  auth('user'),
  validateRequest(validateUserSchema.profileUpdateValidation),
  UserControllers.updateUser,
);

router.post('/follow-user/:id', auth('user'), UserControllers.followUser);

router.post('/unfollow-user/:id', auth('user'), UserControllers.unfollowUser);

router.get('/get-single-user/:id', auth('user'), UserControllers.getSingleUser);

export const UserRoutes = router;
