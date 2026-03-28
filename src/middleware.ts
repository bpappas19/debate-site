import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Ensures server routes (including opengraph-image) can read the request pathname when
 * resolving debate segments. Some metadata sub-requests do not populate dynamic params reliably.
 */
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/debate/:path*"],
};
