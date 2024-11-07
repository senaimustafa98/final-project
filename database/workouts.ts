import { sql } from './connect';

export type Workout = {
  id: number;
  title: string;
  created_at: Date;
};

export async function getWorkouts(): Promise<Workout[]> {
  const workouts = await sql`
    SELECT * FROM workouts;
  `;

  // Map the rows to the Workout type
  return workouts.map((row) => ({
    id: row.id,
    title: row.title,
    created_at: row.created_at,
  })) as Workout[]; // Cast to Workout[]
}

export async function createWorkout(title: string): Promise<Workout> {
  const [workout] = await sql`
    INSERT INTO workouts (title)
    VALUES (${title})
    RETURNING *;
  `;
  return workout as Workout;
}

export async function getWorkoutById(id: number): Promise<Workout | null> {
  const [workout] = await sql`
    SELECT * FROM workouts WHERE id = ${id};
  `;
  return workout ? (workout as Workout) : null;
}

export async function updateWorkout(id: number, title: string): Promise<Workout | null> {
  const [updatedWorkout] = await sql`
    UPDATE workouts
    SET title = ${title}
    WHERE id = ${id}
    RETURNING *;
  `;
  return updatedWorkout ? (updatedWorkout as Workout) : null;
}

export async function deleteWorkout(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM workouts WHERE id = ${id};
  `;
  return result.count > 0; // If any rows were deleted, return true
}
