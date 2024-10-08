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
  auth('user', 'admin'),
  validateRequest(validateUserSchema.profileUpdateValidation),
  UserControllers.updateUser,
);

router.post('/follow-user/:id', auth('user'), UserControllers.followUser);

router.post('/unfollow-user/:id', auth('user'), UserControllers.unfollowUser);

router.get(
  '/get-single-user/:id',
  auth('user', 'admin'),
  UserControllers.getSingleUser,
);

router.get('/get-user-info/:id', auth('user'), UserControllers.getUserInfo);

router.post(
  '/become-premium-member',
  auth('user'),
  UserControllers.becomePremiumMember,
);

router.post('/confirmation', UserControllers.paymentConfirmation);

router.get('/get-all-user', auth('admin'), UserControllers.getAllUser);

router.post('/block-user/:id', auth('admin'), UserControllers.blockUser);

router.post('/unblock-user/:id', auth('admin'), UserControllers.unblockUser);

router.delete('/delete-user/:id', auth('admin'), UserControllers.deleteUser);

router.post('/create-admin', auth('admin'), UserControllers.createAdmin);

router.get('/get-all-admin', auth('admin'), UserControllers.getAllAdmin);

router.post(
  '/update-admin/:userId',
  auth('admin'),
  UserControllers.updateAdmin,
);

router.delete('/delete-admin/:id', auth('admin'), UserControllers.deleteAdmin);

export const UserRoutes = router;
