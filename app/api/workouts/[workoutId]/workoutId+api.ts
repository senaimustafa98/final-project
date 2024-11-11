import { sql } from '../../../../database/connect';
import { getWorkoutById, getExercisesByWorkoutId } from '../../../../database/workouts';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const workoutId = url.pathname.split('/').pop();

  if (!workoutId) {
    return {
      status: 400,
      body: { error: 'Workout ID is required' },
    };
  }

  // Fetch workout details
  const workout = await getWorkoutById(Number(workoutId));
  if (!workout) {
    return {
      status: 404,
      body: { error: 'Workout not found' },
    };
  }

  // Fetch exercises for the workout
  const exercises = await getExercisesByWorkoutId(Number(workoutId));
  return {
    status: 200,
    body: { workout, exercises },
  };
}
