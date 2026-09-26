"use client";

import Link from "next/link";
import { useTransition } from "react";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { logoutAction } from "@@/app/(admin)/login/actions";
import { Avatar, AvatarFallback } from "@@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@@/components/ui/sidebar";
import { AdminRoutes } from "@@/lib/admin-session";

export default function NavUser({ username }: { username: string }) {
  const { isMobile } = useSidebar();
  const [pending, startTransition] = useTransition();
  const initials = username.slice(0, 2).toUpperCase();

  const identity = (
    <>
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">{username}</span>
        <span className="truncate text-xs opacity-70">Administrator</span>
      </div>
    </>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              aria-label="User menu"
            >
              {identity}
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {identity}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={AdminRoutes.PROFILE}>
                <UserRound />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={pending}
              onSelect={() => startTransition(() => logoutAction())}
            >
              <LogOut />
              {pending ? "Logging out…" : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
