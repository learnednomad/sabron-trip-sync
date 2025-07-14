'use client';

import { cn } from '@sabron/ui';
import {
  Calendar,
  Home,
  Map,
  Menu,
  Settings,
  User,
  X,
  LogOut,
  CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { useAuth } from '@/providers/auth-provider';


const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Itineraries', href: '/itineraries', icon: Map },
  { name: 'Activities', href: '/activities', icon: Calendar },
  { name: 'Bookings', href: '/bookings', icon: CreditCard },
];

const userNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-0 z-50 lg:hidden',
        sidebarOpen ? 'block' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <nav className="fixed left-0 top-0 flex h-full w-64 flex-col bg-card">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="text-xl font-semibold text-foreground">Sabron Trip Sync</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="size-6 text-foreground" />
            </button>
          </div>
          <div className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  href={item.href}
                >
                  <item.icon className="mr-3 size-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t p-4">
            <div className="space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  className="group flex items-center rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  href={item.href}
                >
                  <item.icon className="mr-3 size-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
              <button
                className="group flex w-full items-center rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => signOut()}
              >
                <LogOut className="mr-3 size-5 shrink-0" />
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <nav className="flex flex-1 flex-col border-r bg-card">
          <div className="flex h-16 items-center px-4">
            <span className="text-xl font-semibold text-foreground">Sabron Trip Sync</span>
          </div>
          <div className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  className={cn(
                    'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  href={item.href}
                >
                  <item.icon className="mr-3 size-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="border-t p-4">
            <div className="space-y-1">
              {userNavigation.map((item) => (
                <Link
                  key={item.name}
                  className="group flex items-center rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                  href={item.href}
                >
                  <item.icon className="mr-3 size-5 shrink-0" />
                  {item.name}
                </Link>
              ))}
              <button
                className="group flex w-full items-center rounded-md p-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => signOut()}
              >
                <LogOut className="mr-3 size-5 shrink-0" />
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">
              {navigation.find(item => pathname.startsWith(item.href))?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
