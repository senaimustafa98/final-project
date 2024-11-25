import type { Sql } from 'postgres';
import { z } from 'zod';

export const exerciseSchema = z.object({
  workoutId: z.number(),
  name: z.string(),
  setNumber: z.number(),
  reps: z.number(),
  weight: z.number(),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE exercises (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      workout_id integer REFERENCES workouts (id) ON DELETE cascade,
      name varchar(50) NOT NULL,
      set_number integer NOT NULL,
      reps integer NOT NULL,
      weight integer NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE exercises`;
}
