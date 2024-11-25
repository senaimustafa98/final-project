import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { createSessionInsecure } from '../../../database/sessions';
import { createUserInsecure, getUserInsecure } from '../../../database/users';
import { ExpoApiResponse } from '../../../util/ExpoApiResponse';
import {
  type User,
  userSchema,
} from '../../../migrations/001_create_users_table';
import { createSerializedRegisterSessionTokenCookie } from '../../../util/cookies';
export type RegisterResponseBodyPost =
  | {
      user: { username: User['username'] };
    }
  | { error: string; errorIssues?: { message: string }[] };
export async function POST(
  request: Request,
): Promise<ExpoApiResponse<RegisterResponseBodyPost>> {
  const requestBody = await request.json();
  const result = userSchema.safeParse(requestBody);
  if (!result.success) {
    return ExpoApiResponse.json(
      {
        error: 'Request does not contain user object',
        errorIssues: result.error.issues,
      },
      {
        status: 400,
      },
    );
  }
  const user = await getUserInsecure(result.data.username);
  if (user) {
    return ExpoApiResponse.json(
      {
        error: 'Username already taken',
      },
      {
        status: 401,
      },
    );
  }
  const passwordHash = await bcryptJs.hash(result.data.password, 12);
  const newUser = await createUserInsecure(result.data.username, passwordHash);
  if (!newUser) {
    return ExpoApiResponse.json(
      {
        error: 'Registration failed',
      },
      {
        status: 500,
      },
    );
  }
  const token = crypto.randomBytes(100).toString('base64');
  const session = await createSessionInsecure(token, newUser.id);
  if (!session) {
    return ExpoApiResponse.json(
      {
        error: 'Sessions creation failed',
      },
      {
        status: 401,
      },
    );
  }
  const serializedCookie = createSerializedRegisterSessionTokenCookie(
    session.token,
  );
  return ExpoApiResponse.json(
    {
      user: {
        username: newUser.username,
      },
    },
    {
      headers: {
        'Set-Cookie': serializedCookie,
      },
    },
  );
}
