"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";

type NavLinkProps = Omit<ComponentProps<typeof Link>, "href" | "prefetch"> & {
  href: string;
};

/**
 * `next/link` that prefetches only on hover, focus or touch. Viewport prefetch
 * pulls in each linked page's high-priority images, which competes with the
 * current page's hero on slow connections.
 */
export default function NavLink({
  href,
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...rest
}: NavLinkProps) {
  const router = useRouter();
  const prefetch = () => {
    if (href.startsWith("/")) router.prefetch(href);
  };

  return (
    <Link
      href={href}
      prefetch={false}
      onMouseEnter={(e) => {
        prefetch();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        prefetch();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        prefetch();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
}
