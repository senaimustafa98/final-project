import type { Sql } from 'postgres';
import { z } from 'zod';

// Corrected schema for consistency with the database
export const workoutSchema = z.object({
  title: z.string(),
  createdAt: z.coerce.date().optional(), // Match `created_at` in the table
  duration: z.string().optional(),
  userId: z.number().optional(), // Match `user_id` in the table
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE workouts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      title varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      duration varchar(50),
      user_id integer REFERENCES users (id) ON DELETE cascade
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE workouts`;
}


//PGHOST=localhost PGDATABASE=workout_tracker PGUSER=workoutapp PGPASSWORD=workoutapp pnpm migrate up
