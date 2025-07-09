import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Decrypt } from "./lib/auth";
import { Role } from "@/enums/role";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const userRoleToken = request.cookies.get("userRole")?.value;
  const userRole = userRoleToken ? Decrypt(userRoleToken) : null;

  const path = request.nextUrl.pathname;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (path.startsWith("/dashboard/manage-doctors")) {
    if (userRole !== Role.Admin) {
      return NextResponse.redirect(new URL("/dashboard/notfound", request.url));
    }
  }


  if (path.startsWith("/dashboard/admin")) {
    if (userRole !== Role.Admin) {
      return NextResponse.redirect(new URL("/dashboard/notfound", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
