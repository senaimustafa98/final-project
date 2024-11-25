import { serialize } from 'cookie';
export function createSerializedRegisterSessionTokenCookie(token: string) {
  const maxAge = 60 * 60 * 24;
  return serialize('sessionToken', token, {
    expires: new Date(Date.now() + maxAge * 1000),
    maxAge: maxAge,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
}
export function deleteSerializedRegisterSessionTokenCookie() {
  return serialize('sessionToken', '', {
    expires: new Date(0),
    maxAge: -1,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
}
