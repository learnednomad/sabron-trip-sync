'use client';

import { 
  Search, 
  Menu, 
  X, 
  Plane, 
  // MapPin, // Currently unused
  // Calendar, // Currently unused
  User,
  Settings,
  LogOut,
  Heart,
  Ticket
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
// import {
//   Command,
//   CommandDialog,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
// } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface NavigationEnhancedProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const _popularDestinations = [
  { id: '1', name: 'Tokyo, Japan', icon: '🇯🇵' },
  { id: '2', name: 'Paris, France', icon: '🇫🇷' },
  { id: '3', name: 'Bali, Indonesia', icon: '🇮🇩' },
  { id: '4', name: 'New York, USA', icon: '🇺🇸' },
  { id: '5', name: 'Barcelona, Spain', icon: '🇪🇸' },
];

const _recentSearches = [
  { id: '1', query: 'Beach resorts in Maldives', type: 'search' },
  { id: '2', query: 'Tokyo travel guide', type: 'search' },
  { id: '3', query: 'Budget trips to Europe', type: 'search' },
];

export const NavigationEnhanced = ({ user }: NavigationEnhancedProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Explore', href: '/explore' },
    { name: 'Trips', href: '/trips' },
    { name: 'Activities', href: '/activities' },
    { name: 'Deals', href: '/deals', badge: 'New' },
  ];

  const handleSearch = (value: string) => {
    // eslint-disable-next-line no-console
    console.log('Searching for:', value);
  };

  return (
    <>
      <header className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b" 
          : "bg-white/80 backdrop-blur-sm"
      )}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href="/">
              <div className="rounded-lg bg-primary p-2">
                <Plane className="size-6 text-primary-foreground" />
              </div>
              <span className="hidden font-display text-xl font-semibold sm:block">
                Sabron Trip Sync
              </span>
            </Link>

            <div className="hidden items-center gap-6 lg:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                  href={item.href}
                >
                  {item.name}
                  {item.badge && (
                    <Badge className="text-xs" variant="secondary">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="hidden items-center gap-2 pr-3 sm:flex"
              variant="outline"
              onClick={() => handleSearch('search')}
            >
              <Search className="size-4" />
              <span className="text-sm text-muted-foreground">Search destinations...</span>
            </Button>

            <Button
              className="sm:hidden"
              size="icon"
              variant="ghost"
              onClick={() => handleSearch('search')}
            >
              <Search className="size-5" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="relative" size="icon" variant="ghost">
                    <Avatar className="size-8">
                      <AvatarImage alt={user.name} src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 size-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Ticket className="mr-2 size-4" />
                    My Trips
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="mr-2 size-4" />
                    Saved
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 size-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <LogOut className="mr-2 size-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get started</Button>
                </Link>
              </div>
            )}

            <Button
              className="lg:hidden"
              size="icon"
              variant="ghost"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div className={cn(
          "fixed inset-0 z-50 lg:hidden",
          mobileMenuOpen ? "block" : "hidden"
        )}>
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
            <div className="flex items-center justify-between border-b p-4">
              <span className="text-lg font-semibold">Menu</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent"
                    )}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    {item.badge && (
                      <Badge variant={pathname === item.href ? "secondary" : "outline"}>
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-6">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full" variant="outline">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Get started</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start" variant="outline">
                        <User className="mr-2 size-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link href="/trips" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full justify-start" variant="outline">
                        <Ticket className="mr-2 size-4" />
                        My Trips
                      </Button>
                    </Link>
                    <Button 
                      className="w-full justify-start text-destructive" 
                      variant="outline"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}