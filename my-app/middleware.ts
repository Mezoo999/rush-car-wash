// Middleware disabled for Vercel deployment
// Enable after configuring environment variables properly

export function middleware() {
  return Response.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
