'use client';

import { useState } from 'react';
import { Button } from '@sabron/ui';
import { Calendar, ChevronDown, Plane, Hotel, Car, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

type TabType = 'flight' | 'hotel' | 'car';

export function FlightBookingHero() {
  const [activeTab, setActiveTab] = useState<TabType>('flight');
  const [tripType, setTripType] = useState('round-trip');
  const [passengerCount, _setPassengerCount] = useState(2);
  const [travelClass, _setTravelClass] = useState('Business Class');
  const [departureDate, setDepartureDate] = useState(new Date('2024-03-22'));
  const [returnDate, setReturnDate] = useState(new Date('2024-04-02'));
  const [fromLocation, setFromLocation] = useState('Behance');
  const [fromCity, setFromCity] = useState('BHN, North America, USA');
  const [toLocation, setToLocation] = useState('Dribbble');
  const [toCity, setToCity] = useState('DRB, Cape Town, South Africa');

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
        <div className="absolute right-0 bottom-0 w-2/3 h-full">
          <div className="relative h-full">
            <Image
              src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&h=800&fit=crop"
              alt="Tower Bridge"
              fill
              className="object-cover object-left"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">
              Hey Buddy! where are you
            </h1>
            <h1 className="text-5xl font-bold text-gray-900 mb-8">
              <span className="relative">
                Flying
                <span className="absolute -bottom-2 left-0 w-full h-3 bg-yellow-300 -z-10" />
              </span>
              {' '}to?
            </h1>
            <Link href="/explore" className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium">
              Explore Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Search Card */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2">
          <div className="container mx-auto px-6">
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-7xl mx-auto">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                {/* Trip Type and Class */}
                <div className="flex items-center space-x-6 mb-4">
                  <button
                    onClick={() => setTripType('round-trip')}
                    className={`flex items-center px-4 py-2 rounded-lg border-2 transition-colors ${
                      tripType === 'round-trip'
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-300 text-gray-600'
                    }`}
                  >
                    Round Trip
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600">
                      {String(passengerCount).padStart(2, '0')} Passengers
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                    
                    <button className="flex items-center px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-600">
                      {travelClass}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Location and Date Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* From */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500 text-sm">FROM</div>
                    <div className="pt-8 pb-4 px-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="font-semibold text-xl">{fromLocation}</div>
                      <div className="text-gray-500 text-sm">{fromCity}</div>
                    </div>
                  </div>

                  {/* Swap Button */}
                  <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:block hidden">
                    <button className="bg-white border-2 border-gray-200 rounded-full p-2 hover:border-gray-300 transition-colors">
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </button>
                  </div>

                  {/* To */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500 text-sm">TO</div>
                    <div className="pt-8 pb-4 px-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="font-semibold text-xl">{toLocation}</div>
                      <div className="text-gray-500 text-sm">{toCity}</div>
                    </div>
                  </div>

                  {/* Departure Date */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500 text-sm">DEPARTURE</div>
                    <div className="pt-8 pb-4 px-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xl">{format(departureDate, 'EEE, dd MMM')}</div>
                          <div className="flex space-x-4 text-sm">
                            <button className="text-gray-500 hover:text-gray-700">Prev</button>
                            <button className="text-gray-500 hover:text-gray-700">Next</button>
                          </div>
                        </div>
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Return Date */}
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-500 text-sm">RETURN</div>
                    <div className="pt-8 pb-4 px-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-xl">{format(returnDate, 'EEE, dd MMM')}</div>
                          <div className="flex space-x-4 text-sm">
                            <button className="text-gray-500 hover:text-gray-700">Prev</button>
                            <button className="text-gray-500 hover:text-gray-700">Next</button>
                          </div>
                        </div>
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="flex justify-end mt-6">
                  <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg">
                    Search Flights
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Popular Destination</h2>
          <Link href="/destinations" className="text-gray-600 hover:text-gray-900 font-medium underline">
            Explore All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((destination) => (
            <div key={destination.id} className="group cursor-pointer">
              <div className="relative h-64 rounded-xl overflow-hidden mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bottom-4 left-4 z-20 text-white">
                  <h3 className="text-xl font-semibold">{destination.name}</h3>
                  <p className="text-sm opacity-90">{destination.country}</p>
                </div>
              </div>
              <p className="text-gray-600 font-medium">{destination.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}