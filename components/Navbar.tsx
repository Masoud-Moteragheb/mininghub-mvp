'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/community', label: 'Community' },
  { href: '/research', label: 'Research' },
  { href: '/marketplace', label: 'Marketplace' },
  { href: '/jobs', label: 'Jobs' },
  { href: '/forum', label: 'Forum' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b bg-emerald-700/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-700/75">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* برند */}
        <Link href="/" className="text-lg font-semibold text-white">
          MiningHub
        </Link>

        {/* منو */}
        <nav className="hidden gap-6 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={
                  active
                    ? 'text-white font-medium'
                    : 'text-emerald-50/90 hover:text-white'
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* نسخه خیلی ساده موبایل؛ بعداً می‌توانیم همبرگری کنیم */}
        <nav className="md:hidden">
          <Link href="/projects" className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white">
            Menu
          </Link>
        </nav>
      </div>
    </header>
  );
}
