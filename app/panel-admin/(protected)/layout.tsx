import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "./admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/panel-admin");
  }

  const signOutAction = async () => {
    "use server";
    await signOut();
  };

  return (
    <SidebarProvider className="overflow-x-hidden">
      <AdminSidebar
        signOutAction={signOutAction}
        user={{
          name: session.user.name ?? null,
          email: session.user.email ?? null,
          avatar: (session.user as any).image ?? null,
        }}
      />
      <SidebarInset className="overflow-x-hidden">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="text-sm text-muted-foreground">Panel Admin</div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 md:p-10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
