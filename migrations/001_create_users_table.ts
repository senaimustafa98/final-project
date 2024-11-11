import type { Sql } from 'postgres';
import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id serial PRIMARY KEY,
      email varchar(50) UNIQUE NOT NULL,
      password varchar(255) NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function down(sql: Sql) {
  await sql`DROP TABLE users`;
}
