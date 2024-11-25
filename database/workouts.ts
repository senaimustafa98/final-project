import { sql } from './connect';

export type Exercise = {
  id: number;
  workoutId: number;
  name: string;
  setNumber: number;
  reps: number;
  weight: number;
};

export type Workout = {
  id: number;
  title: string;
  createdAt: Date;
  duration: string | null;
  userId: number;
  exercises: {
    name: string;
    sets: { reps: number; weight: number }[];
  }[];
};

export async function getWorkouts(userId: number): Promise<Workout[]> {
  try {
    const workouts = await sql<Workout[]>`
      SELECT
        id,
        title,
        to_char(created_at, 'YYYY-MM-DD') AS "createdAt",
        duration,
        user_id AS "userId"
      FROM
        workouts
      WHERE
        user_id = ${userId};
    `;

    const result = await Promise.all(
      workouts.map(async (workout) => {
        const exercises = await getExercisesByWorkoutId(workout.id);
        const groupedExercises = exercises.reduce(
          (acc, exercise) => {
            const existing = acc.find((e) => e.name === exercise.name);
            if (existing) {
              existing.sets.push({
                reps: exercise.reps,
                weight: exercise.weight,
              });
            } else {
              acc.push({
                name: exercise.name,
                sets: [{ reps: exercise.reps, weight: exercise.weight }],
              });
            }
            return acc;
          },
          [] as Workout['exercises'],
        );
        return {
          ...workout,
          exercises: groupedExercises,
        };
      }),
    );

    return result;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return [];
  }
}

export async function createWorkout(
  title: string,
  duration: string | null,
  userId: number,
  exercises: { name: string; sets: { reps: number; weight: number }[] }[],
): Promise<Workout | null> {
  if (!title || !userId) throw new Error('Title and User ID are required');
  try {
    const [workout] = await sql<Workout[]>`
      INSERT INTO
        workouts (title, duration, user_id)
      VALUES
        (
          ${title},
          ${duration},
          ${userId}
        )
      RETURNING
        id,
        title,
        created_at AS "createdAt",
        duration,
        user_id AS "userId";
    `;

    if (!workout) {
      console.error('Error: Workout not created');
      return null;
    }

    for (let exercise of exercises) {
      for (let [index, set] of exercise.sets.entries()) {
        await sql`
          INSERT INTO
            exercises (
              workout_id,
              name,
              set_number,
              reps,
              weight
            )
          VALUES
            (
              ${workout.id},
              ${exercise.name},
              ${index + 1},
              ${set.reps},
              ${set.weight}
            );
        `;
      }
    }

    const workoutWithExercises = await getExercisesByWorkoutId(workout.id);
    workout.exercises = workoutWithExercises.map((exercise) => ({
      name: exercise.name,
      sets: [{ reps: exercise.reps, weight: exercise.weight }],
    }));

    return workout;
  } catch (error) {
    console.error('Error creating workout:', error);
    return null;
  }
}

export async function getExercisesByWorkoutId(
  workoutId: number,
): Promise<Exercise[]> {
  try {
    const exercises = await sql<Exercise[]>`
      SELECT
        id,
        workout_id AS "workoutId",
        name,
        set_number AS "setNumber",
        reps,
        weight
      FROM
        exercises
      WHERE
        workout_id = ${workoutId}
      ORDER BY
        set_number ASC;
    `;

    return exercises.map((exercise) => ({
      ...exercise,
      sets: [{ reps: exercise.reps, weight: exercise.weight }],
    }));
  } catch (error) {
    console.error('Error fetching exercises by workout ID:', error);
    return [];
  }
}
