import { parse } from 'cookie';
import {
  getUserWithWorkoutCount,
  updateUsernameInDB,
} from '../../database/users';
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

  if (!user) {
    return ExpoApiResponse.json({ error: 'User not found' });
  }

  return ExpoApiResponse.json({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
    workoutCount: user.workoutCount || 0,
  });
}

export async function PATCH(
  request: Request,
): Promise<ExpoApiResponse<{ username: string } | { error: string }>> {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.sessionToken;

  if (!token) {
    return ExpoApiResponse.json(
      { error: 'No session token found' },
      { status: 401 },
    );
  }

  const user = token && (await getUserWithWorkoutCount(token));

  if (!user) {
    return ExpoApiResponse.json(
      { error: 'User not authenticated' },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { username } = body;

    if (!username || username.length < 3 || username.length > 20) {
      return ExpoApiResponse.json(
        { error: 'Invalid username. Must be 3-20 characters long.' },
        { status: 400 },
      );
    }

    const updated = await updateUsernameInDB(user.id, username);

    if (!updated) {
      return ExpoApiResponse.json(
        { error: 'Failed to update username. It may already be taken.' },
        { status: 500 },
      );
    }

    return ExpoApiResponse.json({ username });
  } catch (error) {
    console.error('Error updating username:', error);
    return ExpoApiResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
