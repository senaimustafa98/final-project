import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  createdAt: z.string(),
});
