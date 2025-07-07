import Link from 'next/link';
import { Button } from '@sabron/ui';
import { ArrowRight, Calendar, Map, Users, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-6xl">
            Plan Your Perfect Trip with Sabron Trip Sync
          </h1>
          <p className="mt-6 text-lg leading-8 text-primary-foreground/80">
            Create detailed itineraries, collaborate with travel companions, and keep all your bookings in one place.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/signup">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-primary-foreground hover:text-primary-foreground/80">
              Sign in <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for seamless travel planning
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              From initial planning to on-the-go access, we've got you covered.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Calendar className="h-5 w-5 flex-none text-primary" />
                  Smart Itineraries
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Create detailed day-by-day itineraries with activities, bookings, and notes.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Users className="h-5 w-5 flex-none text-primary" />
                  Collaborate
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Invite travel companions to view and edit itineraries in real-time.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Map className="h-5 w-5 flex-none text-primary" />
                  Offline Access
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Access your plans offline with our mobile app. Never lose your way.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
                  <Globe className="h-5 w-5 flex-none text-primary" />
                  Smart Suggestions
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
                  <p className="flex-auto">
                    Get personalized recommendations based on your preferences and travel style.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
