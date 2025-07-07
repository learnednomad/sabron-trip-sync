'use client';

import { useState } from 'react';
import { ActivityCard } from '@/features/activities/components/ActivityCard';
import { Button, Input } from '@sabron/ui';
import { Plus, Search, Calendar } from 'lucide-react';
import { useItineraries } from '@/lib/api-client';

export default function ActivitiesPage() {
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">All Activities</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
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
              <div className="text-xs text-muted-foreground font-medium">
                From: {activity.itineraryTitle}
              </div>
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-muted-foreground mb-4">
            <Calendar className="h-full w-full" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No activities found</h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start by creating an itinerary with activities'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Activity
          </Button>
        </div>
      )}
    </div>
  );
}
