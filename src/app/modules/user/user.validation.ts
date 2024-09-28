import { z } from 'zod';

const userRegistrationValidation = z.object({
  body: z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    profilePicture: z.string().optional(),
  }),
});

export const validateUserSchema = {
  userRegistrationValidation,
};
