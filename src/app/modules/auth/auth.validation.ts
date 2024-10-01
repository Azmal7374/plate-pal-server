import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email:z.string({required_error:"Email must be provided."}).email(),
        password:z.string({required_error:"Password must be provided."}),
    }),
});

export const  AuthValidation = {
 loginValidationSchema,
}