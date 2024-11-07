import type { Sql } from 'postgres';
import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      username varchar(50) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
