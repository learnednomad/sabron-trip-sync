'use client';

import { Button } from '@sabron/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CreateItineraryForm } from '@/features/itineraries/components/CreateItineraryForm';
import { ItineraryCard } from '@/features/itineraries/components/ItineraryCard';
import { useItineraries } from '@/lib/api-client';

export default function ItinerariesPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { data: itineraries, isLoading, error } = useItineraries();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-destructive">Error loading itineraries</p>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Create Itinerary</h1>
          <Button
            variant="outline"
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </div>
        <CreateItineraryForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">My Itineraries</h1>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 size-4" />
          Create Itinerary
        </Button>
      </div>

      {itineraries?.items && itineraries.items.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {itineraries.items.map((itinerary) => (
            <ItineraryCard key={itinerary.id} itinerary={itinerary} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto size-24 text-muted-foreground">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-foreground">No itineraries</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first trip.</p>
          <div className="mt-6">
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 size-4" />
              Create Itinerary
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
