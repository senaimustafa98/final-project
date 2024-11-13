import { sql } from './connect';

export type Workout = {
  id: number;
  title: string;
  created_at: Date;
  duration: string | null;
  user_id: number;
};

export type Exercise = {
  id: number;
  workout_id: number;
  name: string;
  set_number: number;
  reps: number;
  weight: number | null;
};

// Fetch all workouts for a specific user
export async function getWorkouts(user_id: number): Promise<Workout[]> {
  try {
    const workouts = await sql`
      SELECT
        *
      FROM
        workouts
      WHERE
        user_id = ${user_id};
    `;

    return workouts.map((row) => ({
      id: row.id,
      title: row.title,
      created_at: row.created_at,
      duration: row.duration,
      user_id: row.user_id,
    })) as Workout[];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

// Create a new workout
export async function createWorkout(
  title: string,
  duration: string | null,
  user_id: number,
): Promise<Workout | null> {
  if (!title || !user_id) throw new Error('Title and User ID are required');
  try {
    const [workout] = await sql`
      INSERT INTO
        workouts (title, duration, user_id)
      VALUES
        (
          ${title},
          ${duration},
          ${user_id}
        )
      RETURNING
        *;
    `;
    return workout as Workout;
  } catch (error) {
    console.error('Error creating workout:', error);
    return null;
  }
}

// Fetch a specific workout by ID
export async function getWorkoutById(id: number): Promise<Workout | null> {
  try {
    const [workout] = await sql`
      SELECT
        *
      FROM
        workouts
      WHERE
        id = ${id};
    `;
    return workout ? (workout as Workout) : null;
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    return null;
  }
}

// Fetch exercises associated with a specific workout ID
export async function getExercisesByWorkoutId(
  workoutId: number,
): Promise<Exercise[]> {
  try {
    const exercises = await sql`
      SELECT
        *
      FROM
        exercises
      WHERE
        workout_id = ${workoutId}
      ORDER BY
        set_number ASC;
    `;
    return exercises.map((row) => ({
      id: row.id,
      workout_id: row.workout_id,
      name: row.name,
      set_number: row.set_number,
      reps: row.reps,
      weight: row.weight,
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching exercises by workout ID:', error);
    return [];
  }
}

// Update a workout title and duration
export async function updateWorkout(
  id: number,
  title: string,
  duration: string | null,
): Promise<Workout | null> {
  if (!title) throw new Error('Title is required');
  try {
    const [updatedWorkout] = await sql`
      UPDATE workouts
      SET
        title = ${title},
        duration = ${duration}
      WHERE
        id = ${id}
      RETURNING
        *;
    `;
    return updatedWorkout ? (updatedWorkout as Workout) : null;
  } catch (error) {
    console.error('Error updating workout:', error);
    return null;
  }
}

// Delete a workout by ID
export async function deleteWorkout(id: number): Promise<boolean> {
  try {
    const result = await sql`
      DELETE FROM workouts
      WHERE
        id = ${id};
    `;
    return result.count > 0; // If any rows were deleted, return true
  } catch (error) {
    console.error('Error deleting workout:', error);
    return false;
  }
}
