"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@@/components/ui/sidebar";
import { AdminRoutes } from "@@/lib/admin-session";
import { ADMIN_NAV } from "./nav-config";
import NavUser from "./NavUser";

export default function AdminSidebar({ username }: { username: string }) {
  const pathname = usePathname() ?? "";
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="hover:bg-transparent active:bg-transparent"
            >
              <Link href={AdminRoutes.PROJECTS} aria-label="EVA admin home">
                {/* The wordmark is too wide for the icon rail, so it falls back to a chip. */}
                <span className="hidden aspect-square size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-[10px] font-bold text-sidebar-primary-foreground group-data-[collapsible=icon]:flex">
                  EVA
                </span>
                <Image
                  src="/images/common/eva-logo.avif"
                  alt="EVA Entertainment"
                  width={128}
                  height={36}
                  sizes="128px"
                  className="h-8 w-auto group-data-[collapsible=icon]:hidden"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        if (isMobile) setOpenMobile(false);
                      }}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser username={username} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
