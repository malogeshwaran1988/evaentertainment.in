"use client";

import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOGO_ALT } from "@@/constants/constants";
import { NAV_ITEMS, Routes, serviceHref, type NavItem, type ServiceSlug } from "@@/constants/routes";

const SCROLL_TOP_THRESHOLD = 80;

/** Site chrome header — mounted once via `(web)/layout` for all public pages. */
export function Header({ serviceNames }: { serviceNames: Record<ServiceSlug, string> }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [subDismissed, setSubDismissed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setSubOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("fixed", menuOpen);
    return () => {
      document.body.classList.remove("menu-open");
      document.body.classList.remove("fixed");
    };
  }, [menuOpen]);

  // Mobile drawer behaves like a modal: Esc closes it, Tab stays inside, focus returns to the toggle.
  useEffect(() => {
    if (!menuOpen) return;
    const nav = navRef.current;
    const toggle = toggleRef.current;
    const focusables = () =>
      [
        ...(nav?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []),
        ...(toggle ? [toggle] : []),
      ].filter((el) => el.offsetParent !== null || el === toggle);
    // Only trap when the drawer is actually shown (mobile layout).
    if (!nav || getComputedStyle(nav).visibility === "hidden") return;
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggle?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const pastTop = y > SCROLL_TOP_THRESHOLD;
      setIsSticky(pastTop);

      if (!pastTop) {
        setIsHidden(false);
      } else if (!reduceMotion) {
        if (y > lastScrollY.current + 4) {
          setIsHidden(true);
        } else if (y < lastScrollY.current - 4) {
          setIsHidden(false);
        }
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = y;
    };

    lastScrollY.current = window.scrollY || document.documentElement.scrollTop;
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("hdr-sticky", isSticky);
    return () => document.body.classList.remove("hdr-sticky");
  }, [isSticky]);

  const isActive = (item: NavItem) => {
    if (item.children) return item.children.some((slug) => pathname === serviceHref(slug));
    if (item.href === Routes.HOME) return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const contactCurrent =
    pathname === Routes.CONTACT || pathname.startsWith(`${Routes.CONTACT}/`)
      ? ("page" as const)
      : undefined;

  const headerClass = [
    "header",
    "header--transparent",
    isSticky ? "is-sticky" : "",
    isHidden ? "is-header-hidden" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="header-wrap">
        <div className="eva-header-bar">
          <div className="logo">
            <Link href={Routes.HOME}>
              <Image
                src="/images/common/eva-logo.avif"
                alt={LOGO_ALT}
                width={160}
                height={45}
                loading="eager"
                sizes="160px"
              />
            </Link>
          </div>

          <nav
            ref={navRef}
            id="primary-menu"
            className={`header-menu${menuOpen ? " is-open opened" : ""}`}
            aria-label="Primary"
          >
            <ul className="menu">
              {NAV_ITEMS.map((item) =>
                item.children ? (
                  <li
                    key={item.href}
                    className={[
                      "eva-nav-has-sub",
                      isActive(item) ? "active" : "",
                      subOpen ? "is-sub-open" : "",
                      subDismissed ? "is-sub-dismissed" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onMouseEnter={() => setSubDismissed(false)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setSubOpen(false);
                        setSubDismissed(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== "Escape") return;
                      setSubOpen(false);
                      setSubDismissed(true);
                      e.currentTarget.querySelector<HTMLButtonElement>(".eva-nav-sub-toggle")?.focus();
                    }}
                  >
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : isActive(item) ? "true" : undefined}
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      className="eva-nav-sub-toggle"
                      aria-expanded={subOpen}
                      aria-controls="nav-services-menu"
                      aria-label={`${item.label.charAt(0)}${item.label.slice(1).toLowerCase()} submenu`}
                      onClick={() => {
                        setSubOpen((v) => !v);
                        setSubDismissed(false);
                      }}
                    >
                      <span aria-hidden="true" />
                    </button>
                    <ul id="nav-services-menu" className="eva-nav-sub">
                      {item.children.map((slug) => {
                        const href = serviceHref(slug);
                        return (
                          <li key={slug}>
                            <Link href={href} aria-current={pathname === href ? "page" : undefined}>
                              {serviceNames[slug]}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                ) : (
                  <li key={item.href} className={isActive(item) ? "active" : undefined}>
                    <Link
                      href={item.href}
                      aria-current={
                        pathname === item.href ? "page" : isActive(item) ? "true" : undefined
                      }
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
              <li className="header-menu-contact-item">
                <Link
                  href={Routes.CONTACT}
                  className="header-contact-cta header-contact-cta--drawer"
                  aria-current={contactCurrent}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link
              href={Routes.CONTACT}
              className="header-contact-cta header-contact-cta--bar"
              aria-current={contactCurrent}
            >
              Contact Us
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className={`menu-toggle${menuOpen ? " opened" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="primary-menu"
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <i className="icon icon-three" aria-hidden="true" />
              <i className="icon icon-remove" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          className="darkOverlay"
          role="presentation"
          onClick={() => setMenuOpen(false)}
        />
      </div>
    </header>
  );
}

export default Header;
