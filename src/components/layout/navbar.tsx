'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, LogOut, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LogoWordmark } from '@/components/logo-mark';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { RouteTicker } from './route-ticker';
import { mainNav } from '@/lib/data';
import { cn, initials } from '@/lib/utils';
import { getMe, type CurrentUser } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';

function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (!getToken()) return;
    getMe()
      .then(setUser)
      .catch(() => clearToken());
  }, []);

  return [user, setUser] as const;
}

function AccountMenu({ user, onSignOut }: { user: CurrentUser; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className="flex h-9 items-center gap-2 border border-border bg-secondary px-2.5 text-sm font-semibold transition-colors hover:bg-secondary/70"
      >
        <span className="flex h-6 w-6 items-center justify-center border border-foreground bg-primary text-[11px] font-bold text-primary-foreground">
          {initials(user.displayName)}
        </span>
        <span className="hidden max-w-[9rem] truncate normal-case tracking-normal xl:inline">
          {user.displayName}
        </span>
      </button>
      {open && (
        <div className="panel-thick absolute right-0 top-full z-10 w-56 shadow-[6px_6px_0_0_var(--color-primary)]">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold">{user.displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Link
            href="/app"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:bg-secondary"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onSignOut();
            }}
            className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left text-sm font-medium text-destructive hover:bg-destructive/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-secondary"
    >
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="hidden h-4 w-4 dark:block" />
    </button>
  );
}

export function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [user, setUser] = useCurrentUser();

  const signOut = () => {
    clearToken();
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <RouteTicker />
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="shrink-0">
          <LogoWordmark />
        </Link>

        <nav className="hidden items-stretch lg:flex" onMouseLeave={() => setOpenMenu(null)}>
          {mainNav.map((item) =>
            'items' in item ? (
              <div
                key={item.label}
                className="relative flex items-stretch"
                onMouseEnter={() => setOpenMenu(item.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setOpenMenu(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpenMenu(null);
                }}
              >
                <button
                  type="button"
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                  onClick={() => setOpenMenu((v) => (v === item.label ? null : item.label))}
                  onFocus={() => setOpenMenu(item.label)}
                  className={cn(
                    'flex items-center border-l border-border px-4 text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground',
                    openMenu === item.label && 'bg-secondary text-foreground',
                  )}
                >
                  {item.label}
                </button>
                {openMenu === item.label && (
                  <div className="panel-thick absolute left-0 top-full z-10 w-80 shadow-[6px_6px_0_0_var(--color-primary)]">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block border-b border-border px-5 py-3 last:border-b-0 hover:bg-secondary"
                      >
                        <p className="text-sm font-semibold">{sub.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{sub.description}</p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center border-l border-border px-4 text-sm font-medium uppercase tracking-wide text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {user ? (
            <AccountMenu user={user} onSignOut={signOut} />
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center border border-border"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </Container>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {mainNav.flatMap((item) =>
              'items' in item
                ? item.items.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border px-4 py-3 text-sm font-medium uppercase tracking-wide hover:bg-secondary"
                    >
                      {sub.label}
                    </Link>
                  ))
                : [
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-border px-4 py-3 text-sm font-medium uppercase tracking-wide hover:bg-secondary"
                    >
                      {item.label}
                    </Link>,
                  ],
            )}
            {user ? (
              <div className="mt-2 flex flex-col gap-2 px-4">
                <p className="text-sm font-semibold">{user.displayName}</p>
                <Button variant="primary" size="sm" asChild>
                  <Link href="/app" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMobileOpen(false);
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-2 flex gap-2 px-4">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href="/signin" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" asChild>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="mx-4 mt-2" asChild>
                  <Link href="/app" onClick={() => setMobileOpen(false)}>
                    Preview the app
                  </Link>
                </Button>
              </>
            )}
          </Container>
        </div>
      )}
    </header>
  );
}
