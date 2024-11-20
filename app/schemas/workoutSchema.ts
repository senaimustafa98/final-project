import { z } from 'zod';

export const exerciseSchema = z.object({
  name: z.string(),
  sets: z.array(
    z.object({
      reps: z.number(),
      weight: z.number(),
    }),
  ),
});

export const workoutSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  duration: z.string().nullable(),
  userId: z.number(),
  exercises: z.array(exerciseSchema),
});

export type Exercise = z.infer<typeof exerciseSchema>;
export type Workout = z.infer<typeof workoutSchema>;
