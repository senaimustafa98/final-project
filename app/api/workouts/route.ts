import { createWorkout, getWorkouts } from '../../../database/workouts';
import { workoutSchema } from '../../../migrations/001_create_workouts_table';

// GET request to fetch workouts
export async function GET() {
  const workouts = await getWorkouts();
  return {
    status: 200,
    body: { workouts },
  };
}

// POST request to create a new workout
export async function POST(request: Request) {
  const body = await request.json();
  const result = workoutSchema.safeParse(body);

  if (!result.success) {
    return {
      status: 400,
      body: { error: 'Invalid workout data' },
    };
  }

  const newWorkout = await createWorkout(result.data.title);
  return {
    status: 201,
    body: { workout: newWorkout },
  };
}
