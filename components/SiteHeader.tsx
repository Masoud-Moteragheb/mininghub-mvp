"use client";

import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/community", label: "Community" },
    
  // صفحات آماده نیستند → disabled
  { label: "Research", disabled: true },
  { label: "Marketplace", disabled: true },
  { label: "Jobs", disabled: true },

  { href: "/events", label: "Events" },
];

export default function SiteHeader() {
  return (
    <header className="bg-emerald-800 text-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          MiningHub
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8 text-sm">

          {navItems.map((item, idx) => {
            if (item.disabled) {
              // لینک غیرفعال
              return (
                <span
                  key={idx}
                  className="text-gray-400 cursor-not-allowed select-none"
                  title="Coming soon"
                >
                  {item.label}
                </span>
              );
            }

            // لینک فعال
            return (
              <Link
                key={item.href}
                href={item.href!}
                className="transition hover:text-yellow-200"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3 text-sm">
          <button className="rounded-full border border-white/70 px-4 py-1 hover:bg-white/10">
            Sign in
          </button>
          <button className="rounded-full bg-white px-4 py-1 font-medium text-emerald-800 hover:bg-slate-100">
            Join
          </button>
        </div>
      </div>
    </header>
  );
}
