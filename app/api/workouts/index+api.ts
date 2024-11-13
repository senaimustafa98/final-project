import { getWorkouts, createWorkout } from '../../../database/workouts';
import { ExpoApiResponse } from '../../../util/ExpoApiResponse';
import { type Workout, workoutSchema } from '../../schemas/workoutSchema';

// Define the response type for GET requests (success)
export type WorkoutsResponseBodyGet = {
  workouts: Workout[];
};

// Define the response type for error responses
export type ErrorResponseBody = {
  error: string;
  errorIssues?: { message: string }[];
};

// Handle GET request to fetch all workouts for a specific user
export async function GET(request: Request): Promise<ExpoApiResponse<WorkoutsResponseBodyGet | ErrorResponseBody>> {
  const url = new URL(request.url);
  const user_id = Number(url.searchParams.get('user_id')); // Extract user_id from query params

  if (!user_id) {
    return ExpoApiResponse.json(
      { error: 'User ID is required' },
      { status: 400 }
    );
  }

  const workouts = await getWorkouts(user_id);

  return ExpoApiResponse.json({
    workouts: workouts,
  });
}

// Define the response type for POST requests (success)
export type WorkoutsResponseBodyPost = {
  workout: Workout;
} | ErrorResponseBody;

// Handle POST request to create a new workout
export async function POST(request: Request): Promise<ExpoApiResponse<WorkoutsResponseBodyPost>> {
  const requestBody = await request.json();

  // Validate the request body using the workout schema
  const result = workoutSchema.safeParse(requestBody);

  if (!result.success) {
    return ExpoApiResponse.json(
      {
        error: 'Invalid workout data',
        errorIssues: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }

  const newWorkout = {
    title: result.data.title,
    duration: result.data.duration,
    user_id: result.data.user_id, // Ensure user_id is included in the request
    exercises: result.data.exercises, // Include exercises from the request
  };

  const workout = await createWorkout(
    newWorkout.title,
    newWorkout.duration,
    newWorkout.user_id,
    newWorkout.exercises // Pass exercises to the function
  );

  if (!workout) {
    return ExpoApiResponse.json(
      {
        error: 'Workout not created',
      },
      {
        status: 500,
      },
    );
  }

  // Explicitly ensure exercises is always an array, even if it's undefined
  workout.exercises = workout.exercises || []; // If exercises is undefined, set it as an empty array

  return ExpoApiResponse.json({ workout: workout });
}
