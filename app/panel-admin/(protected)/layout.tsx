import Link from "next/link";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { auth, signOut } from "@/auth";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DemoModeBanner } from "@/components/demo-mode-banner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const cookieStore = await cookies();
  const isDemoMode =
    cookieStore.get("essenceos_demo")?.value === "true" || !session?.user;

  // Guest Demo User fallback for public portfolio visitors
  const user = session?.user || {
    name: "Invitado Portafolio",
    email: "demo@essenceos.app",
    role: "ADMIN",
    image: null,
  };

  const signOutAction = async () => {
    "use server";
    await signOut();
  };

  return (
    <SidebarProvider className="overflow-x-hidden">
      <AdminSidebar
        signOutAction={signOutAction}
        isDemoMode={isDemoMode}
        user={{
          name: user.name ?? "Invitado Portafolio",
          email: user.email ?? "demo@essenceos.app",
          avatar: (user as any).image ?? null,
        }}
      />
      <SidebarInset className="overflow-x-hidden">
        <DemoModeBanner isDemoMode={isDemoMode} />
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span>Panel ERP Admin</span>
              {isDemoMode ? (
                <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                  Demo Live
                </span>
              ) : (
                <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                  Producción
                </span>
              )}
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 md:p-8 flex flex-col min-h-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
