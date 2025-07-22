'use client';

import { Button, Input } from '@sabron/ui';
import { Plus, Search, Calendar } from 'lucide-react';
import { useState } from 'react';

import { ActivityCard } from '@/features/activities/components/ActivityCard';
import { useItineraries } from '@/lib/api-client';

const ActivitiesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: itineraries, isLoading } = useItineraries();

  const allActivities = itineraries?.items.flatMap(itinerary =>
    itinerary.activities.map(activity => ({
      ...activity,
      itineraryTitle: itinerary.title
    }))
  ) || [];

  const filteredActivities = allActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.location.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'dining', 'attraction', 'transport', 'accommodation', 'shopping', 'entertainment', 'other'];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">All Activities</h1>
        <Button>
          <Plus className="mr-2 size-4" />
          Add Activity
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              className="whitespace-nowrap"
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {filteredActivities.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">
                From: {activity.itineraryTitle}
              </div>
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 size-24 text-muted-foreground">
            <Calendar className="size-full" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">No activities found</h3>
          <p className="mb-6 text-muted-foreground">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by creating an itinerary with activities'}
          </p>
          <Button>
            <Plus className="mr-2 size-4" />
            Add Your First Activity
          </Button>
        </div>
      )}
    </div>
  );
};

export default ActivitiesPage;
