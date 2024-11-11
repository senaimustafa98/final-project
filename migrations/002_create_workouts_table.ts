import type { Sql } from 'postgres';
import { z } from 'zod';

export const workoutSchema = z.object({
  title: z.string(),
  date: z.coerce.date().optional(),
  duration: z.string().optional(),
  user_id: z.number().optional(),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE workouts (
      id serial PRIMARY KEY,
      title varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      duration varchar(50),
      user_id integer REFERENCES users(id) ON DELETE CASCADE
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE workouts`;
}


//PGHOST=localhost PGDATABASE=workout_tracker PGUSER=workoutapp PGPASSWORD=workoutapp pnpm migrate up
