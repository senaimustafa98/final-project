import { sql } from './connect';

export type Workout = {
  id: number;
  title: string;
  created_at: Date;
  duration: string | null;
  user_id: number;
  exercises: Exercise[]; // Ensure exercises are included in the Workout type
};

export type Exercise = {
  id: number;
  workout_id: number;
  name: string;
  set_number: number;
  reps: number;
  weight: number | null;
};

// Fetch all workouts for a specific user, including exercises
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

    // Fetch exercises for each workout and attach them
    const result = await Promise.all(
      workouts.map(async (workout) => {
        const exercises = await getExercisesByWorkoutId(workout.id);
        return {
          ...workout,
          exercises: exercises || [], // Ensure exercises is always an array (even if empty)
        };
      })
    );

    return result as Workout[];
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}


// Create a new workout and insert related exercises
export async function createWorkout(
  title: string,
  duration: string | null,
  user_id: number,
  exercises: { name: string; sets: { reps: number; weight: number }[] }[] // Include exercises in the function
): Promise<Workout | null> {
  if (!title || !user_id) throw new Error('Title and User ID are required');
  try {
    // Insert the workout into the workouts table
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

    if (!workout) {
      console.error('Error: Workout not created');
      return null;
    }

    // Insert exercises related to this workout
    for (let exercise of exercises) {
      await sql`
        INSERT INTO exercises (workout_id, name, sets)
        VALUES (${workout.id}, ${exercise.name}, ${JSON.stringify(exercise.sets)});
      `;
    }

    // Fetch and return the workout with exercises attached
    const workoutWithExercises = await sql`
      SELECT * FROM workouts WHERE id = ${workout.id};
      SELECT * FROM exercises WHERE workout_id = ${workout.id};
    `;

    workout.exercises = workoutWithExercises[1] || []; // Ensure exercises is always an array
    return workout as Workout;
  } catch (error) {
    console.error('Error creating workout:', error);
    return null;
  }
}
// Fetch a specific workout by ID, including its exercises
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

    if (!workout) {
      return null;
    }

    // Fetch exercises associated with the workout
    const exercises = await getExercisesByWorkoutId(id);
    workout.exercises = exercises;

    return workout as Workout;
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
