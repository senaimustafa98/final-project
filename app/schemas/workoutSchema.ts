import { z } from 'zod';

export const workoutSchema = z.object({
  title: z.string(),
  duration: z.string().nullable(),
  user_id: z.number(),
  exercises: z.array(
    z.object({
      name: z.string(),
      sets: z.array(
        z.object({
          reps: z.number(),
          weight: z.number(),
        }),
      ),
    }),
  ),
});

export type Workout = z.infer<typeof workoutSchema>;
