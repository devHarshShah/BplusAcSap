import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function verifyToken(req: NextRequest) {
  try {
    const token = req.cookies.get('token');
    if (!token) {
      // Check if the request is for an API call
      if (req.url.includes('/api/')) {
        return new NextResponse(JSON.stringify({ error: 'Token is missing or invalid', redirectTo: '/auth/login' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    await jwtVerify(token.value, key);
    // If verification is successful, proceed
    return NextResponse.next();
  } catch (error) {
    // Distinguish between API calls and regular page requests
    if (req.url.includes('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Token expired', redirectTo: '/auth/login' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}