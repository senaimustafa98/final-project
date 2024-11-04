import type { Sql } from 'postgres';
import { z } from 'zod';


export const workoutSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  duration: z.string().optional(),
});

// Migration to create the `workouts` table
export async function up(sql: Sql) {
  await sql`
    CREATE TABLE workouts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(100),
      date timestamptz DEFAULT now(),
      duration interval
    )
  `;
}

// Rollback function to drop the `workouts` table
export async function down(sql: Sql) {
  await sql`DROP TABLE workouts`;
}
