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
  sets: number[];
  reps: number[];
  weights: number[];
};

// Fetch all workouts for a specific user
export async function getWorkouts(user_id: number): Promise<Workout[]> {
  const workouts = await sql`
    SELECT * FROM workouts WHERE user_id = ${user_id};
  `;

  return workouts.map((row) => ({
    id: row.id,
    title: row.title,
    created_at: row.created_at,
    duration: row.duration,
    user_id: row.user_id,
  })) as Workout[];
}

// Create a new workout
export async function createWorkout(title: string, duration: string | null, user_id: number): Promise<Workout> {
  const [workout] = await sql`
    INSERT INTO workouts (title, duration, user_id)
    VALUES (${title}, ${duration}, ${user_id})
    RETURNING *;
  `;
  return workout as Workout;
}

// Fetch a specific workout by ID
export async function getWorkoutById(id: number): Promise<Workout | null> {
  const [workout] = await sql`
    SELECT * FROM workouts WHERE id = ${id};
  `;
  return workout ? (workout as Workout) : null;
}

// Fetch exercises associated with a specific workout ID
export async function getExercisesByWorkoutId(workoutId: number): Promise<Exercise[]> {
  const exercises = await sql`
    SELECT * FROM exercises WHERE workout_id = ${workoutId};
  `;
  return exercises.map((row) => ({
    id: row.id,
    workout_id: row.workout_id,
    name: row.name,
    sets: row.sets,
    reps: row.reps,
    weights: row.weights,
  })) as Exercise[];
}

// Update a workout title and duration
export async function updateWorkout(id: number, title: string, duration: string | null): Promise<Workout | null> {
  const [updatedWorkout] = await sql`
    UPDATE workouts
    SET title = ${title}, duration = ${duration}
    WHERE id = ${id}
    RETURNING *;
  `;
  return updatedWorkout ? (updatedWorkout as Workout) : null;
}

// Delete a workout by ID
export async function deleteWorkout(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM workouts WHERE id = ${id};
  `;
  return result.count > 0; // If any rows were deleted, return true
}
