'use client';

import { Button } from '@sabron/ui';
import { format } from 'date-fns';
import { Calendar, ChevronDown, Plane, Hotel, Car, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type TabType = 'flight' | 'hotel' | 'car';

export const FlightBookingHero = () => {
  const [activeTab, setActiveTab] = useState<TabType>('flight');
  const [tripType, _setTripType] = useState('round-trip');
  const [passengerCount, _setPassengerCount] = useState(2);
  const [travelClass, _setTravelClass] = useState('Business Class');
  const [departureDate, _setDepartureDate] = useState(new Date('2024-03-22'));
  const [returnDate, _setReturnDate] = useState(new Date('2024-04-02'));
  const [fromLocation, _setFromLocation] = useState('Behance');
  const [fromCity, _setFromCity] = useState('BHN, North America, USA');
  const [toLocation, _setToLocation] = useState('Dribbble');
  const [toCity, _setToCity] = useState('DRB, Cape Town, South Africa');

  const tabs = [
    { id: 'flight' as TabType, label: 'Flight', icon: Plane },
    { id: 'hotel' as TabType, label: 'Hotel', icon: Hotel },
    { id: 'car' as TabType, label: 'Rent a Car', icon: Car },
  ];

  const popularDestinations = [
    { id: 1, name: 'Paris', country: 'France', image: '/images/paris.jpg', price: 'From $299' },
    { id: 2, name: 'Tokyo', country: 'Japan', image: '/images/tokyo.jpg', price: 'From $599' },
    { id: 3, name: 'New York', country: 'USA', image: '/images/newyork.jpg', price: 'From $199' },
    { id: 4, name: 'London', country: 'UK', image: '/images/london.jpg', price: 'From $249' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background */}
      <div className="relative h-[600px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-200 via-sky-300 to-teal-400" />
        
        {/* Tower Bridge Image */}
        <div className="absolute bottom-0 right-0 h-full w-2/3">
          <div className="relative h-full">
            <Image
              fill
              priority
              alt="Tower Bridge"
              className="object-cover object-left"
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop"
            />
          </div>
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <h1 className="mb-2 text-5xl font-bold text-gray-900">
              Hey Buddy! where are you
            </h1>
            <h1 className="mb-8 text-5xl font-bold text-gray-900">
              <span className="relative">
                Flying
                <span className="absolute -bottom-2 left-0 -z-10 h-3 w-full bg-yellow-300" />
              </span>
              {' '}to?
            </h1>
            <Link className="inline-flex items-center font-medium text-gray-700 hover:text-gray-900" href="/explore">
              Explore Now
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>

        {/* Search Card */}
        <div className="absolute inset-x-0 bottom-0 translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-2xl">
              {/* Tabs */}
              <div className="mb-6 flex space-x-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={`flex items-center rounded-lg px-6 py-3 font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="mr-2 size-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                {/* Trip Type and Class */}
                <div className="mb-4 flex items-center space-x-6">
                  <button
                    className={`flex items-center rounded-lg border-2 px-4 py-2 transition-colors ${
                      tripType === 'round-trip'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-600'
                    }`}
                    onClick={() => setTripType('round-trip')}
                  >
                    Round Trip
                    <ChevronDown className="ml-2 size-4" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-600">
                      {String(passengerCount).padStart(2, '0')} Passengers
                      <ChevronDown className="ml-2 size-4" />
                    </button>
                    
                    <button className="flex items-center rounded-lg border-2 border-gray-300 px-4 py-2 text-gray-600">
                      {travelClass}
                      <ChevronDown className="ml-2 size-4" />
                    </button>
                  </div>
                </div>

                {/* Location and Date Inputs */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  {/* From */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-sm text-gray-500">FROM</div>
                    <div className="cursor-pointer rounded-lg border-2 border-gray-200 px-4 pb-4 pt-8 transition-colors hover:border-gray-300">
                      <div className="text-xl font-semibold">{fromLocation}</div>
                      <div className="text-sm text-gray-500">{fromCity}</div>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="absolute left-1/4 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
                    <button className="rounded-full border-2 border-gray-200 bg-white p-2 transition-colors hover:border-gray-300">
                      <svg className="size-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                      </svg>
                    </button>
                  </div>

                  {/* To */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-sm text-gray-500">TO</div>
                    <div className="cursor-pointer rounded-lg border-2 border-gray-200 px-4 pb-4 pt-8 transition-colors hover:border-gray-300">
                      <div className="text-xl font-semibold">{toLocation}</div>
                      <div className="text-sm text-gray-500">{toCity}</div>
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-sm text-gray-500">DEPARTURE</div>
                    <div className="cursor-pointer rounded-lg border-2 border-gray-200 px-4 pb-4 pt-8 transition-colors hover:border-gray-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-semibold">{format(departureDate, 'EEE, dd MMM')}</div>
                          <div className="flex space-x-4 text-sm">
                            <button className="text-gray-500 hover:text-gray-700">Prev</button>
                            <button className="text-gray-500 hover:text-gray-700">Next</button>
                          </div>
                        </div>
                        <Calendar className="size-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-sm text-gray-500">RETURN</div>
                    <div className="cursor-pointer rounded-lg border-2 border-gray-200 px-4 pb-4 pt-8 transition-colors hover:border-gray-300">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xl font-semibold">{format(returnDate, 'EEE, dd MMM')}</div>
                          <div className="flex space-x-4 text-sm">
                            <button className="text-gray-500 hover:text-gray-700">Prev</button>
                            <button className="text-gray-500 hover:text-gray-700">Next</button>
                          </div>
                        </div>
                        <Calendar className="size-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="mt-6 flex justify-end">
                  <Button className="rounded-lg bg-gray-900 px-8 py-3 text-white hover:bg-gray-800" size="lg">
                    Search Flights
                    <ArrowRight className="ml-2 size-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-6 pb-16 pt-32">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destination</h2>
          <Link className="font-medium text-gray-600 underline hover:text-gray-900" href="/destinations">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {popularDestinations.map((destination) => (
            <div key={destination.id} className="group cursor-pointer">
              <div className="relative mb-4 h-64 overflow-hidden rounded-xl">
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />
                <Image
                  fill
                  alt={destination.name}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  src={destination.image}
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                </div>
              </div>
              <p className="font-medium text-gray-600">{destination.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}