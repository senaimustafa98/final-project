import type { User } from '../migrations/001_create_users_table';
import type { Session } from '../migrations/004_create_session_table';
import { sql } from './connect';

type UserWithPasswordHash = User & {
  passwordHash: string;
};

export async function getUser(sessionToken: Session['token']) {
  const [user] = await sql<Pick<User, 'id' | 'username' | 'createdAt'>[]>`
    SELECT
      users.id,
      users.username,
      to_char(users.created_at, 'YYYY-MM-DD') AS "createdAt"
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
      to_char(users.created_at, 'YYYY-MM-DD') AS "createdAt"
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
      to_char(users.created_at, 'YYYY-MM-DD') AS "createdAt"
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
    createdAt: string;
    workoutCount: number;
  }[]>`
    SELECT
      users.id,
      users.username,
      to_char(users.created_at, 'YYYY-MM-DD') AS "createdAt",
      COALESCE(COUNT(workouts.id), 0) AS "workoutCount"
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
  return user;
}

// Function to update a user's username
export async function updateUsernameInDB(userId: number, newUsername: string): Promise<boolean> {
  try {
    // Check if the username already exists and is not used by the current user
    const [existingUser] = await sql<Pick<User, 'id'>[]>`
      SELECT id
      FROM users
      WHERE username = ${newUsername.toLowerCase()} AND id != ${userId}
    `;

    if (existingUser) {
      // Username is already taken
      return false;
    }

    // Update the username in the database
    const result = await sql`
      UPDATE users
      SET username = ${newUsername.toLowerCase()}
      WHERE id = ${userId}
    `;

    // Check if the update affected any rows
    return result.count > 0;
  } catch (error) {
    console.error('Error updating username:', error);
    return false;
  }
}
