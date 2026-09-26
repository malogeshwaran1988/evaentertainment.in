"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@@/components/ui/breadcrumb";
import { Separator } from "@@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@@/components/ui/sidebar";
import AdminThemeProvider from "@@/components/admin/theme/AdminThemeProvider";
import ThemeToggle from "@@/components/admin/theme/ThemeToggle";
import AdminSidebar from "./AdminSidebar";
import { breadcrumbsFor } from "./nav-config";

type AdminShellProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  username: string;
};

export default function AdminShell({
  children,
  defaultOpen = true,
  username,
}: AdminShellProps) {
  const pathname = usePathname() ?? "";
  const mainRef = useRef<HTMLDivElement>(null);

  // The content region scrolls, not the document, so reset it on navigation.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  const crumbs = useMemo(() => breadcrumbsFor(pathname), [pathname]);

  return (
    <AdminThemeProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AdminSidebar username={username} />
        <SidebarInset className="h-svh overflow-hidden md:h-[calc(100svh-1rem)]">
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex min-w-0 items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  {crumbs.map((item, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                      <span key={`${item.label}-${index}`} className="contents">
                        {index > 0 ? <BreadcrumbSeparator /> : null}
                        <BreadcrumbItem>
                          {isLast || !item.href ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink asChild>
                              <Link href={item.href}>{item.label}</Link>
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </span>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <ThemeToggle />
          </header>
          <div
            ref={mainRef}
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto p-4 md:p-6"
          >
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminThemeProvider>
  );
}
