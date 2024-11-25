import crypto from 'node:crypto';
import bcryptJs from 'bcryptjs';
import { createSessionInsecure } from '../../../database/sessions';
import { getUserWithPasswordHashInsecure } from '../../../database/users';
import { ExpoApiResponse } from '../../../util/ExpoApiResponse';
import {
  type User,
  userSchema,
} from '../../../migrations/001_create_users_table';
import { createSerializedRegisterSessionTokenCookie } from '../../../util/cookies';
export type LoginResponseBodyPost =
  | {
      user: { username: User['username'] };
    }
  | { error: string; errorIssues?: { message: string }[] };
export async function POST(
  request: Request,
): Promise<ExpoApiResponse<LoginResponseBodyPost>> {
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
  const userWithPasswordHash = await getUserWithPasswordHashInsecure(
    result.data.username,
  );
  if (!userWithPasswordHash) {
    return ExpoApiResponse.json(
      {
        error: 'Username or password not valid',
      },
      {
        status: 401,
      },
    );
  }
  const passwordHash = await bcryptJs.compare(
    result.data.password,
    userWithPasswordHash.passwordHash,
  );
  if (!passwordHash) {
    return ExpoApiResponse.json(
      {
        error: 'Username or password not valid',
      },
      {
        status: 401,
      },
    );
  }
  const token = crypto.randomBytes(100).toString('base64');
  const session = await createSessionInsecure(token, userWithPasswordHash.id);
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
        username: userWithPasswordHash.username,
      },
    },
    {
      headers: {
        'Set-Cookie': serializedCookie,
      },
    },
  );
}
