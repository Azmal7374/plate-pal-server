import { z } from 'zod';

const userRegistrationValidation = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    profilePicture: z.string().optional(),
  }),
});

const profileUpdateValidation = z.object({
  body: z.object({
    name: z.string(),
    profilePicture: z.string(),
    bio: z.string(),
  }),
});

export const validateUserSchema = {
  userRegistrationValidation,
  profileUpdateValidation,
};
