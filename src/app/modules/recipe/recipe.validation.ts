import { ObjectId } from 'mongoose';
import { title } from 'process';
import { z } from 'zod';


const createRecipeValidation = z.object({
title: z.string(),
image: z.string(),
content: z.string(),
})

export const validateRecipeSchema = {
    createRecipeValidation,
}