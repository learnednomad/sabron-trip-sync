'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateItinerarySchema, type CreateItinerary } from '@sabron/validation';
import { Button, FormField, Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { useCreateItinerary } from '@/lib/api-client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CreateItineraryFormProps {
  onSuccess?: () => void;
}

export function CreateItineraryForm({ onSuccess }: CreateItineraryFormProps) {
  const [step, setStep] = useState(1);
  const createItinerary = useCreateItinerary();

  const form = useForm<CreateItinerary>({
    resolver: zodResolver(CreateItinerarySchema),
    defaultValues: {
      title: '',
      description: '',
      destinations: [{
        name: '',
        country: '',
        coordinates: { lat: 0, lng: 0 },
        timezone: 'UTC',
      }],
      dateRange: {
        start: '',
        end: '',
      },
      budget: {
        total: { amount: 0, currency: 'USD' },
        currency: 'USD',
      },
    },
  });

  const onSubmit = async (data: CreateItinerary) => {
    try {
      await createItinerary.mutateAsync(data);
      toast.success('Itinerary created successfully!');
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create itinerary');
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Itinerary</CardTitle>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                stepNumber === step
                  ? 'bg-primary text-primary-foreground'
                  : stepNumber < step
                  ? 'bg-green-600 text-white'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {stepNumber}
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  name="title"
                  label="Trip Title"
                  placeholder="e.g., Paris Summer Vacation"
                />
                <FormField
                  name="description"
                  label="Description (Optional)"
                  placeholder="Tell us about your trip..."
                />
                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Destination & Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="destinations.0.name"
                    label="Destination"
                    placeholder="e.g., Paris"
                  />
                  <FormField
                    name="destinations.0.country"
                    label="Country"
                    placeholder="e.g., France"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="dateRange.start"
                    label="Start Date"
                    type="date"
                  />
                  <FormField
                    name="dateRange.end"
                    label="End Date"
                    type="date"
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Budget</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="budget.estimated.amount"
                    label="Total Budget"
                    type="number"
                    placeholder="1000"
                  />
                  <FormField
                    name="budget.currency"
                    label="Currency"
                    placeholder="USD"
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    type="submit"
                    loading={createItinerary.isPending}
                  >
                    Create Itinerary
                  </Button>
                </div>
              </div>
            )}
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
