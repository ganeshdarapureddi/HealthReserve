import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Decrypt } from "./src/lib/auth";
import { Role } from "@/enums/role";

export function middleware(request: NextRequest,response:NextResponse) {
  // const userIdToken = request.cookies.get("userId")?.value;
  const userRoleToken = request.cookies.get("userRole")?.value;
  const token=request.cookies.get("token")?.value;

  // console.log("token at middleware:",token);
  const path = request.nextUrl.pathname;

  // const userId = Decrypt(userIdToken);
  const userRole = Decrypt(userRoleToken);

  if(!token){
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  if (!token && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userRole) {
    if (userRole === Role.Admin) {
      const isAllowed =
        path === "/dashboard" || path.startsWith("/dashboard/admin");
      if (!isAllowed) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } else {
      if (path.startsWith("/dashboard/admin")) {
        return NextResponse.redirect(
          new URL("/dashboard/notfound", request.url)
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
