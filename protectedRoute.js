// lib/protectedRoutes.js
export const protectedRoutes = [
    // '/dashboard',
    // '/profile',
    '/todo',
    // Add other protected routes here
  ];
  
  export function isProtectedRoute(pathname) {
    return protectedRoutes.some(route => pathname.startsWith(route));
  }
  