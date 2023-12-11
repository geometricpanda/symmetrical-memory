import { NextRequest, NextResponse } from 'next/server';
import { deviceIdCookieName, isValidToken } from './app/_utils';
import { v4 } from 'uuid';

const { NEXT_PUBLIC_STORYBLOK_TOKEN } = process.env;


if (!NEXT_PUBLIC_STORYBLOK_TOKEN) {
  throw new Error('NEXT_PUBLIC_STORYBLOK_TOKEN not found');
}

export const middleware = async (request: NextRequest) => {


  if (request.nextUrl.pathname.startsWith('/bridge')) {

    const storyId = request.nextUrl.searchParams.get('_storyblok');
    const spaceId = request.nextUrl.searchParams.get('_storyblok_tk[space_id]');
    const timestamp = request.nextUrl.searchParams.get('_storyblok_tk[timestamp]');
    const token = request.nextUrl.searchParams.get('_storyblok_tk[token]');

    if (!storyId || !spaceId || !timestamp || !token) {
      return NextResponse.json({ 'Error': 'Missing params' }, { status: 400 });
    }

    const isValid = await isValidToken(spaceId, NEXT_PUBLIC_STORYBLOK_TOKEN, timestamp, token);

    if (!isValid) {
      return Response.json({ 'Error': 'Invalid token' }, { status: 403 });
    }

    const deviceId = request.cookies.get(deviceIdCookieName);

    if (!deviceId) {
      const response = NextResponse.redirect(request.nextUrl.clone());
      response.cookies.set(deviceIdCookieName, v4(), {
        secure: true,
        sameSite: 'none',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10)
      });

      return response
    }

  }

  return NextResponse.next();

};
