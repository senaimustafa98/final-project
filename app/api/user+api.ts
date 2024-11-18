import { parse } from 'cookie';
import { getUser } from '../../database/users';
import { ExpoApiResponse } from '../../util/ExpoApiResponse';
import type { User } from '../../migrations/001_create_users_table';
export type UserResponseBodyGet =
  | {
      username: User['username'];
      createdAt: string;
    }
  | {
      error: string;
      errorIssues?: { message: string }[];
    };
export async function GET(
  request: Request,
): Promise<ExpoApiResponse<UserResponseBodyGet>> {
  // 1. get the session token from the cookie
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;
  if (!token) {
    return ExpoApiResponse.json({
      error: 'No session token found',
    });
  }
  // 2. validate that session
  // 3. get the user profile matching the session
  const user = token && (await getUser(token));
  if (!user) {
    return ExpoApiResponse.json({ error: 'User not found' });
  }
  // 4. return the user profile
  return ExpoApiResponse.json({ username: user.username, createdAt: user.created_at, });
}
