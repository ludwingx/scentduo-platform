import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

const authHandler = NextAuth(authConfig).auth;

export default authHandler((req) => {
  const { nextUrl } = req;

  // Entering demo mode: set cookie + rewrite to panel-admin
  if (nextUrl.pathname.startsWith("/demo")) {
    let cleanSubPath = nextUrl.pathname.replace(/^\/demo/, "");
    if (cleanSubPath.startsWith("/panel-admin")) {
      cleanSubPath = cleanSubPath.replace(/^\/panel-admin/, "");
    }
    if (!cleanSubPath || cleanSubPath === "/") {
      cleanSubPath = "/dashboard";
    }

    const targetUrl = new URL(`/panel-admin${cleanSubPath}`, req.url);
    targetUrl.searchParams.set("demo", "true");
    const response = NextResponse.rewrite(targetUrl);
    response.cookies.set("essenceos_demo", "true", { path: "/" });
    return response;
  }

  // Exiting demo mode: clear cookie when going to login or navigating panel-admin directly
  if (nextUrl.pathname === "/login" || nextUrl.pathname.startsWith("/panel-admin")) {
    const hasDemoCookie = req.cookies?.get("essenceos_demo")?.value === "true";
    if (hasDemoCookie) {
      const response = NextResponse.next();
      response.cookies.delete("essenceos_demo");
      return response;
    }
  }
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
