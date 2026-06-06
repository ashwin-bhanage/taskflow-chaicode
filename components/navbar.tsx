"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggle } = useTheme();

  const navLinks = [
    { href: "/tasks", label: "My Tasks" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/public-stats", label: "Stats" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className="sticky top-0 z-50"
      style={{ borderBottom: "1px solid var(--tf-border)", background: "var(--tf-surface)" }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="6" fill="var(--tf-red)" />
              <path d="M7 10L13.5 14L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 14L13.5 18L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
            </svg>
            <span className="font-bold text-base tracking-tight" style={{ color: "var(--tf-text)" }}>
              TaskFlow
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-md text-sm transition-colors"
                  style={{
                    color: isActive ? "var(--tf-red)" : "var(--tf-text-muted)",
                    background: isActive ? "var(--tf-red-light)" : "transparent",
                    fontWeight: isActive ? "600" : "400",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--tf-text-muted)", background: "var(--tf-surface-2)" }}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                /* Sun icon */
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                /* Moon icon */
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Add Task CTA */}
            <Link
              href="/tasks/new"
              className="hidden sm:flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--tf-red)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-md"
              style={{ color: "var(--tf-text-muted)" }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <nav className="md:hidden pb-3 pt-2 border-t" style={{ borderColor: "var(--tf-border)" }}>
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 rounded-md text-sm font-medium"
                    style={{
                      color: isActive ? "var(--tf-red)" : "var(--tf-text)",
                      background: isActive ? "var(--tf-red-light)" : "transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/tasks/new"
                onClick={() => setMobileOpen(false)}
                className="mt-1 px-3 py-2 rounded-md text-sm font-semibold text-white text-center"
                style={{ background: "var(--tf-red)" }}
              >
                + Add Task
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
