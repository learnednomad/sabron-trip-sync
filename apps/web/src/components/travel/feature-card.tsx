'use client';


import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import type { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: 'primary' | 'secondary' | 'accent' | 'sky' | 'sand' | 'forest' | 'coral';
  className?: string;
}

const colorVariants = {
  primary: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground',
  secondary: 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground',
  accent: 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground',
  sky: 'bg-travel-sky/10 text-travel-sky group-hover:bg-travel-sky group-hover:text-white',
  sand: 'bg-travel-sand/10 text-travel-sand group-hover:bg-travel-sand group-hover:text-white',
  forest: 'bg-travel-forest/10 text-travel-forest group-hover:bg-travel-forest group-hover:text-white',
  coral: 'bg-travel-coral/10 text-travel-coral group-hover:bg-travel-coral group-hover:text-white',
};

export const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'primary',
  className 
}: FeatureCardProps) => {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
    >
      <div className="absolute right-0 top-0 size-32 -translate-y-16 translate-x-16 rounded-full bg-gradient-to-br from-transparent to-primary/5 transition-transform duration-500 group-hover:scale-150" />
      
      <CardHeader>
        <div className={cn(
          "inline-flex p-3 rounded-lg transition-all duration-300",
          colorVariants[color]
        )}>
          <Icon className="size-6" />
        </div>
      </CardHeader>
      
      <CardContent>
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}