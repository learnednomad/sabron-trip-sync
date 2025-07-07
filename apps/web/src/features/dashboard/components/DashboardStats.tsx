'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { Calendar, Map, DollarSign, Users } from 'lucide-react';
import { useItineraries } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';

export function DashboardStats() {
  const { data: itineraries } = useItineraries();

  const stats = [
    {
      title: 'Total Trips',
      value: itineraries?.items.length || 0,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Upcoming Trips',
      value: itineraries?.items.filter(i => i.status === 'planned').length || 0,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Budget',
      value: formatCurrency(
        itineraries?.items.reduce((sum, i) => sum + (i.budget?.total.amount || 0), 0) || 0,
        'USD'
      ),
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Collaborators',
      value: itineraries?.items.reduce((sum, i) => sum + i.collaborators.length, 0) || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-md ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
