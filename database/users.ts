import type { User } from '../migrations/001_create_users_table';
import type { Session } from '../migrations/004_create_session_table';
import { sql } from './connect';
type UserWithPasswordHash = User & {
  passwordHash: string;
};
export async function getUser(sessionToken: Session['token']) {
  const [user] = await sql<Pick<User, 'username' | 'created_at' >[]>`
    SELECT
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
