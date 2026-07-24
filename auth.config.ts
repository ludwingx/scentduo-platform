import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { nextUrl } = request;
      const isOnAdminPanel = nextUrl.pathname.startsWith("/panel-admin");
      const isDemoMode =
        nextUrl.searchParams.get("demo") === "true" ||
        nextUrl.pathname.startsWith("/demo") ||
        request.cookies?.get("essenceos_demo")?.value === "true";

      if (isOnAdminPanel) {
        if (isLoggedIn || isDemoMode) return true;
        return false; // Redirect unauthenticated users to login page
      }

      // Auto-redirect logged-in users away from login/register pages
      if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
      ) {
        return Response.redirect(new URL("/panel-admin/dashboard", nextUrl));
      }

      return true;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
