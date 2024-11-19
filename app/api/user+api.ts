import { parse } from 'cookie';
import { getUser } from '../../database/users';
import { ExpoApiResponse } from '../../util/ExpoApiResponse';
import type { User } from '../../migrations/001_create_users_table';

export type UserResponseBodyGet =
  | {
      id: User['id'];
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
      const cookies = parse(request.headers.get('cookie') || '');
      const token = cookies.sessionToken;

      if (!token) {
        return ExpoApiResponse.json({ error: 'No session token found' });
      }

      const user = token && (await getUser(token));

      if (!user) {
        return ExpoApiResponse.json({ error: 'User not found' });
      }

      return ExpoApiResponse.json({
        id: user.id,
        username: user.username,
        createdAt: user.created_at,
      });
    }
