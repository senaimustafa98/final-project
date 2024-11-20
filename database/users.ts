import type { User } from '../migrations/001_create_users_table';
import type { Session } from '../migrations/004_create_session_table';
import { sql } from './connect';
type UserWithPasswordHash = User & {
  passwordHash: string;
};
export async function getUser(sessionToken: Session['token']) {
  const [user] = await sql<Pick<User, 'id' | 'username' | 'created_at'>[]>`
    SELECT
      users.id,
      users.username,
      users.created_at
    FROM
      users
      INNER JOIN sessions ON (
        sessions.token = ${sessionToken}
        AND users.id = sessions.user_id
        AND expiry_timestamp > now()
      )
  `;
  return user;
}
export async function getUserInsecure(username: User['username']) {
  const [user] = await sql<User[]>`
    SELECT
      users.id,
      users.username,
      users.created_at
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
  `;
  return user;
}
export async function createUserInsecure(
  username: User['username'],
  passwordHash: UserWithPasswordHash['passwordHash'],
) {
  const [user] = await sql<User[]>`
    INSERT INTO
      users (username, password_hash)
    VALUES
      (
        ${username.toLowerCase()},
        ${passwordHash}
      )
    RETURNING
      users.id,
      users.username,
      users.created_at
  `;
  return user;
}
export async function getUserWithPasswordHashInsecure(
  username: User['username'],
) {
  const [user] = await sql<UserWithPasswordHash[]>`
    SELECT
      *
    FROM
      users
    WHERE
      username = ${username.toLowerCase()}
  `;
  return user;
}

export async function getUserWithWorkoutCount(sessionToken: Session['token']) {
  const [user] = await sql<{
    id: number;
    username: string;
    created_at: string;
    workout_count: number;
  }[]>`
    SELECT
      users.id,
      users.username,
      to_char(users.created_at, 'YYYY-MM-DD') AS created_at,
      COALESCE(COUNT(workouts.id), 0) AS workout_count
    FROM
      users
    LEFT JOIN workouts ON workouts.user_id = users.id
    INNER JOIN sessions ON (
      sessions.token = ${sessionToken}
      AND users.id = sessions.user_id
      AND expiry_timestamp > now()
    )
    GROUP BY users.id, users.username;
  `;
  console.warn('User from Database Query:', user);
  return user;
}
