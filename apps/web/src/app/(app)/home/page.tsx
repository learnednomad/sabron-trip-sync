'use client';

import { 
  Shield, 
  Globe, 
  Calendar,
  Users,
  CreditCard,
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { 
  SearchCard, 
  DestinationCard, 
  FeatureCard,
  ActivityCard 
} from '@/components/travel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Sample data
const popularDestinations = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    rating: 4.9,
    reviews: 2847,
    price: 899,
    currency: 'USD',
    tags: ['Beach', 'Romance', 'Culture'],
    liked: true,
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    rating: 4.8,
    reviews: 3126,
    price: 1299,
    currency: 'USD',
    tags: ['Culture', 'History', 'Nature'],
  },
  {
    id: '3',
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.7,
    reviews: 4523,
    price: 799,
    currency: 'USD',
    tags: ['Beach', 'Adventure', 'Wellness'],
  },
  {
    id: '4',
    name: 'Dubai',
    country: 'UAE',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    rating: 4.8,
    reviews: 3789,
    price: 1499,
    currency: 'USD',
    tags: ['Luxury', 'Shopping', 'Modern'],
  },
];

const topActivities = [
  {
    id: '1',
    title: 'Sunset Sailing in Santorini',
    location: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800',
    duration: 180,
    rating: 4.9,
    reviews: 523,
    price: 89,
    currency: 'USD',
    category: 'water sports',
    groupSize: { min: 2, max: 8 },
    popular: true,
  },
  {
    id: '2',
    title: 'Traditional Tea Ceremony',
    location: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=800',
    duration: 120,
    rating: 4.8,
    reviews: 341,
    price: 65,
    currency: 'USD',
    category: 'culture',
    groupSize: { min: 1, max: 6 },
  },
  {
    id: '3',
    title: 'Rice Terrace Trekking',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    duration: 240,
    rating: 4.7,
    reviews: 789,
    price: 45,
    currency: 'USD',
    category: 'adventure',
    groupSize: { min: 2, max: 10 },
  },
];

const HomePage = () => {
  const [likedDestinations, setLikedDestinations] = useState<string[]>(['1']);

  const handleLike = (id: string) => {
    setLikedDestinations((prev) => 
      prev.includes(id) 
        ? prev.filter((destId) => destId !== id)
        : [...prev, id]
    );
  };

  const handleSearch = (data: { destination: string; checkIn: Date | undefined; checkOut: Date | undefined; guests: string }) => {
    // eslint-disable-next-line no-console
    console.log('Search data:', data);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            fill
            priority
            alt="Travel background"
            className="object-cover"
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1920"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center text-white">
          <Badge className="mb-4 animate-fade-down" variant="secondary">
            <Star className="mr-1 size-3" />
            Trusted by 50,000+ travelers
          </Badge>
          
          <h1 className="mb-6 animate-fade-up text-4xl font-bold sm:text-6xl lg:text-7xl">
            Your Next Adventure
            <span className="block text-travel-sky">Starts Here</span>
          </h1>
          
          <p className="animation-delay-200 mx-auto mb-12 max-w-2xl animate-fade-up text-lg text-gray-200 sm:text-xl">
            Discover amazing destinations, plan perfect trips, and create unforgettable memories with our AI-powered travel platform.
          </p>

          <div className="animation-delay-400 mx-auto max-w-4xl animate-zoom-in">
            <SearchCard className="shadow-2xl" onSearch={handleSearch} />
          </div>

          <div className="animation-delay-600 mt-12 flex animate-fade-up flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-travel-sky" />
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-5 text-travel-coral" />
              <span>24/7 Customer Support</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="size-5 text-travel-sand" />
              <span>Secure Payment</span>
            </div>
          </div>
        </div>

        <button className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <ArrowRight className="size-5 rotate-90 text-white" />
          </div>
        </button>
      </section>

      {/* Popular Destinations */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4" variant="outline">
              <Globe className="mr-1 size-3" />
              Trending Now
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Popular Destinations
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Explore our hand-picked destinations loved by thousands of travelers worldwide
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                className="animate-fade-up"
                destination={{
                  ...destination,
                  liked: likedDestinations.includes(destination.id),
                }}
                onLike={handleLike}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" variant="outline">
              View All Destinations
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4" variant="outline">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Travel Made Simple
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to plan, book, and enjoy your perfect trip
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              color="primary"
              description="AI-powered itinerary builder creates personalized travel plans based on your preferences"
              icon={Calendar}
              title="Smart Trip Planning"
            />
            <FeatureCard
              color="secondary"
              description="Comprehensive insurance and 24/7 support ensures peace of mind throughout your journey"
              icon={Shield}
              title="Travel Protection"
            />
            <FeatureCard
              color="accent"
              description="Easily plan and sync trips with friends and family with our collaborative tools"
              icon={Users}
              title="Group Coordination"
            />
            <FeatureCard
              color="sky"
              description="Split payments, pay later options, and multi-currency support for hassle-free booking"
              icon={CreditCard}
              title="Flexible Payment"
            />
            <FeatureCard
              color="coral"
              description="Connect with verified local guides and discover authentic hidden gems"
              icon={Globe}
              title="Local Experiences"
            />
            <FeatureCard
              color="sand"
              description="Earn points on every booking and unlock exclusive perks and discounts"
              icon={Star}
              title="Rewards Program"
            />
          </div>
        </div>
      </section>

      {/* Top Activities */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <Badge className="mb-4" variant="outline">
              Experiences
            </Badge>
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Top Activities & Tours
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Book unique experiences and create lasting memories
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {topActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onBook={(id) => {
                  // eslint-disable-next-line no-console
                  console.log('Book activity:', id);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-primary py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative mx-auto max-w-4xl px-6 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/90">
            Join thousands of travelers who trust us to make their travel dreams come true
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Get Started Free
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button className="bg-white/10 text-white hover:bg-white/20" size="lg" variant="outline">
              <Play className="mr-2 size-4" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;