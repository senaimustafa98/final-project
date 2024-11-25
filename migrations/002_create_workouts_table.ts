import type { Sql } from 'postgres';
import { z } from 'zod';

export const workoutSchema = z.object({
  title: z.string(),
  createdAt: z.coerce.date().optional(),
  duration: z.string().optional(),
  userId: z.number().optional(),
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
