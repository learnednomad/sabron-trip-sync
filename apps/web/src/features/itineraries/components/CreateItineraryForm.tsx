'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormField, Card, CardContent, CardHeader, CardTitle } from '@sabron/ui';
import { CreateItinerarySchema, type CreateItinerary } from '@sabron/validation';
import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { toast } from 'sonner';

import { useCreateItinerary } from '@/lib/api-client';
import { cn } from '@/lib/utils';

interface CreateItineraryFormProps {
  onSuccess?: () => void;
}

export const CreateItineraryForm = ({ onSuccess }: CreateItineraryFormProps) => {
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
    <Card className="mx-auto w-full max-w-2xl">
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
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <FormField
                  label="Trip Title"
                  name="title"
                  placeholder="e.g., Paris Summer Vacation"
                />
                <FormField
                  label="Description (Optional)"
                  name="description"
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
                    label="Destination"
                    name="destinations.0.name"
                    placeholder="e.g., Paris"
                  />
                  <FormField
                    label="Country"
                    name="destinations.0.country"
                    placeholder="e.g., France"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Start Date"
                    name="dateRange.start"
                    type="date"
                  />
                  <FormField
                    label="End Date"
                    name="dateRange.end"
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
                    label="Total Budget"
                    name="budget.estimated.amount"
                    placeholder="1000"
                    type="number"
                  />
                  <FormField
                    label="Currency"
                    name="budget.currency"
                    placeholder="USD"
                  />
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                  <Button
                    loading={createItinerary.isPending}
                    type="submit"
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
