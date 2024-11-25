import { getWorkouts, createWorkout } from '../../../database/workouts';
import { parse } from 'cookie';
import { getUserWithWorkoutCount } from '../../../database/users';
import { ExpoApiResponse } from '../../../util/ExpoApiResponse';
import { workoutSchema, type Workout } from '../../schemas/workoutSchema';

export type WorkoutsResponseBodyGet = {
  workouts: Workout[];
};

export type ErrorResponseBody = {
  error: string;
  errorIssues?: { message: string }[];
};

export type WorkoutsResponseBodyPost =
  | {
      workout: Workout;
    }
  | ErrorResponseBody;

export async function GET(
  request: Request,
): Promise<ExpoApiResponse<WorkoutsResponseBodyGet | ErrorResponseBody>> {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json(
      { error: 'No session token found' },
      { status: 401 },
    );
  }

  const user = await getUserWithWorkoutCount(token);

  if (!user) {
    return ExpoApiResponse.json(
      { error: 'User not authenticated' },
      { status: 403 },
    );
  }

  const workouts = await getWorkouts(user.id);

  return ExpoApiResponse.json({
    workouts,
    workoutCount: user.workoutCount,
  });
}

export async function POST(
  request: Request,
): Promise<ExpoApiResponse<WorkoutsResponseBodyPost>> {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json(
      { error: 'No session token found' },
      { status: 401 },
    );
  }

  const user = await getUserWithWorkoutCount(token);

  if (!user) {
    return ExpoApiResponse.json(
      { error: 'User not authenticated' },
      { status: 403 },
    );
  }

  const requestBody = await request.json();

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
    userId: result.data.userId,
    exercises: result.data.exercises.map((exercise) => ({
      name: exercise.name,
      sets: exercise.sets.map((set) => ({
        reps: set.reps,
        weight: set.weight ?? 0,
      })),
    })),
  };

  const workout = await createWorkout(
    newWorkout.title,
    newWorkout.duration,
    newWorkout.userId,
    newWorkout.exercises,
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

  return ExpoApiResponse.json({ workout });
}
