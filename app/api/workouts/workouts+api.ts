import { z } from 'zod';
import { sql } from '../../../database/connect';

// Define workout schema using Zod
const workoutSchema = z.object({
  title: z.string(),
  duration: z.string().optional(),
  user_id: z.number(),
});

// Example GET endpoint for fetching workouts
export async function GET() {
  try {
    const workouts = await sql`
      SELECT * FROM workouts;
    `;
    return {
      status: 200,
      body: { workouts },
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Failed to retrieve workouts' },
    };
  }
}

// Example POST endpoint for creating a workout
export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    const validation = workoutSchema.safeParse(requestBody);

    if (!validation.success) {
      return {
        status: 400,
        body: { error: 'Invalid data format' },
      };
    }

    const { title, duration = null, user_id } = validation.data;

    // Replace undefined duration with null
    const workoutDuration = duration === undefined ? null : duration;

    const [newWorkout] = await sql`
      INSERT INTO workouts (title, duration, user_id)
      VALUES (${title}, ${workoutDuration}, ${user_id})
      RETURNING *;
    `;
    return {
      status: 201,
      body: { workout: newWorkout },
    };
  } catch (error) {
    return {
      status: 500,
      body: { error: 'Failed to create workout' },
    };
  }
}
