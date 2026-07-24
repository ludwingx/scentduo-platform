"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Settings,
  Store,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
  signOutAction,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    avatar?: string | null;
  };
  signOutAction?: (() => void) | undefined;
}) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const isDemoMode = pathname?.startsWith("/demo") || user.email === "demo@essenceos.app";

  const initials = (user.name || user.email || "U")
  const getLinkPath = (path: string) => (isDemoMode ? `/demo${path}` : path);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name || "Usuario"} />
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name || "Usuario"}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email || "demo@essenceos.app"}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name || "Usuario"} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name || "Usuario"}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email || "demo@essenceos.app"}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="h-3 w-3" /> Admin ERP
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={getLinkPath("/panel-admin/configuracion/perfil")} className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>Mi Perfil & Cuenta</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={getLinkPath("/panel-admin/configuracion")} className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span>Configuración ERP</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/" target="_blank" className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span>Ver Tienda Pública</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {signOutAction ? (
              <form action={signOutAction} className="w-full">
                <DropdownMenuItem asChild className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                  <button type="submit" className="w-full flex items-center gap-2">
                    <LogOut className="h-4 w-4 text-destructive" />
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </DropdownMenuItem>
              </form>
            ) : (
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="h-4 w-4 text-destructive" />
                <span className="font-medium">Cerrar Sesión</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

