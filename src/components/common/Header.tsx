"use client";

import AccessibilityWidget from "@@/components/common/AccessibilityWidget";
import Image from "next/image";
import Link from "@@/components/common/NavLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LOGO_ALT, SITE_NAME } from "@@/constants/constants";
import { NAV_ITEMS, Routes, serviceHref, type NavItem, type NavLinkChild, type ServiceSlug } from "@@/constants/routes";

const SCROLL_TOP_THRESHOLD = 80;

/** Site chrome header — mounted once via `(web)/layout` for all public pages. */
export function Header({
  serviceNames,
  segmentLinks,
  languageLinks,
}: {
  serviceNames: Record<ServiceSlug, string>;
  /** Live segment pages with projects; overrides SEGMENTS.links. Empty hides the dropdown. */
  segmentLinks?: readonly NavLinkChild[];
  /** Live language pages with target projects; overrides LANGUAGES.links. Empty hides the dropdown. */
  languageLinks?: readonly NavLinkChild[];
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  /** Which top-level dropdown is open (item.label), or null. */
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const [subDismissed, setSubDismissed] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  /** Close every menu after a pick; blur so :focus-within can't hold the panel open. */
  const closeAfterNav = () => {
    setMenuOpen(false);
    setOpenSubId(null);
    setSubDismissed(true);
    const active = document.activeElement as HTMLElement | null;
    if (active && navRef.current?.contains(active)) active.blur();
  };

  useEffect(() => {
    setMenuOpen(false);
    setOpenSubId(null);
    // Pointer may still rest on a dropdown after a client-side navigation; keep panels hidden until re-entry.
    setSubDismissed(true);
    const active = document.activeElement as HTMLElement | null;
    if (active && navRef.current?.contains(active)) active.blur();
  }, [pathname]);

  // Desktop dropdown: close on outside click / tap and on Escape from anywhere.
  useEffect(() => {
    if (!openSubId) return;
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const openLi = navRef.current?.querySelector(".eva-nav-has-sub.is-sub-open");
      if (openLi && !openLi.contains(target)) setOpenSubId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenSubId(null);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openSubId]);

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
    if (item.links?.length) {
      return item.links.some((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));
    }
    if (item.children) {
      // Segment URLs sit under /dubbing-studio/<slug>; keep them off the Services highlight.
      if (pathname.startsWith("/dubbing-studio/")) return false;
      return item.children.some((slug) => pathname === serviceHref(slug));
    }
    if (item.href === Routes.HOME) return pathname === "/";
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const renderDropdown = (item: NavItem) => {
    const subId = `nav-sub-${item.label.toLowerCase()}`;
    const isOpen = openSubId === item.label;
    const linkChildren = item.links
      ? item.links.map((l) => ({ key: l.href, href: l.href, label: l.label }))
      : (item.children ?? []).map((slug) => ({
          key: slug,
          href: serviceHref(slug),
          label: serviceNames[slug],
        }));
    return (
      <li
        key={item.label}
        className={[
          "eva-nav-has-sub",
          isActive(item) ? "active" : "",
          isOpen ? "is-sub-open" : "",
          subDismissed ? "is-sub-dismissed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onMouseEnter={() => setSubDismissed(false)}
        onFocus={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setSubDismissed(false);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setOpenSubId((id) => (id === item.label ? null : id));
          }
        }}
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          setOpenSubId(null);
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
          aria-expanded={isOpen}
          aria-controls={subId}
          aria-label={`${item.label.charAt(0)}${item.label.slice(1).toLowerCase()} submenu`}
          onClick={() => {
            setOpenSubId((id) => (id === item.label ? null : item.label));
            setSubDismissed(false);
          }}
        >
          <span aria-hidden="true" />
        </button>
        <ul id={subId} className="eva-nav-sub">
          {linkChildren.map((child) => (
            <li key={child.key}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? "page" : undefined}
                onClick={closeAfterNav}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </li>
    );
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
                style={{ width: "auto", height: "auto" }}
                loading="eager"
              />
              <span className="sr-only">{SITE_NAME} home</span>
            </Link>
          </div>

          <nav
            ref={navRef}
            id="primary-menu"
            className={`header-menu${menuOpen ? " is-open opened" : ""}`}
            aria-label="Primary"
          >
            <ul className="menu">
              {NAV_ITEMS.flatMap((item) => {
                let resolved: NavItem = item;
                if (item.label === "SEGMENTS" && segmentLinks !== undefined) {
                  resolved = { ...item, links: segmentLinks };
                } else if (item.label === "LANGUAGES" && languageLinks !== undefined) {
                  resolved = { ...item, links: languageLinks };
                }
                if (resolved.label === "SEGMENTS" && !(resolved.links?.length)) return [];
                if (resolved.label === "LANGUAGES" && !(resolved.links?.length)) return [];
                return [resolved];
              }).map((item) =>
                item.children || item.links ? (
                  renderDropdown(item)
                ) : (
                  <li key={item.label} className={isActive(item) ? "active" : undefined}>
                    <Link
                      href={item.href}
                      onClick={closeAfterNav}
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
                  onClick={closeAfterNav}
                  aria-current={contactCurrent}
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <AccessibilityWidget />
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
