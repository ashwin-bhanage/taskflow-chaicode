"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard",    label: "Overview & Stats" },
  { href: "/public-stats", label: "Public Stats (ISR)" },
  { href: "/tasks",        label: "Manage Tasks" },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors"
            style={{
              color: isActive ? "var(--tf-text)" : "var(--tf-text-muted)",
              background: isActive ? "var(--tf-surface-2)" : "transparent",
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full shrink-0 transition-colors"
              style={{
                background: isActive ? "var(--tf-red)" : "var(--tf-text-faint)",
              }}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}