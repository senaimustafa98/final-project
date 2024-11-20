import { parse } from 'cookie';
import { getUserWithWorkoutCount } from '../../database/users';
import { ExpoApiResponse } from '../../util/ExpoApiResponse';
import type { User } from '../../migrations/001_create_users_table';

export type UserResponseBodyGet =
  | {
      id: User['id'];
      username: User['username'];
      createdAt: string;
      workoutCount: number;
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

  const user = token && (await getUserWithWorkoutCount(token));
  console.warn('User from getUserWithWorkoutCount:', user);

  if (!user) {
    return ExpoApiResponse.json({ error: 'User not found' });
  }
   console.warn('User Data to be sent from API:', user);


  return ExpoApiResponse.json({
    id: user.id,
    username: user.username,
    createdAt: user.created_at || 'N/A',
    workoutCount: Number(user.workout_count) || 0,
  });
}
