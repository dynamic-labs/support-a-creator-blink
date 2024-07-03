// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  // Add the custom header
  response.headers.set('ngrok-skip-browser-warning', 'Your Custom Value');

  return response;
}

// Define the paths where the middleware should run
export const config = {
  matcher: '/:path*', // This applies the middleware to all paths
};
