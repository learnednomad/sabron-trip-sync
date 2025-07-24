'use client';

import * as React from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flex, Text, Heading, Box } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { captureException, addSentryBreadcrumb } from '@/lib/sentry';
import type { ServerComponent, AsyncFC } from '@/types/react-19';
import type { ButtonProps, InputProps } from '@/types/ui';
import type { FlexProps, TextProps } from '@/types/radix-themes';

// Form validation schema with Zod
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

// Example of a typed component using all the integrations
export default function ExampleTypedPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Add Sentry breadcrumb
      addSentryBreadcrumb('Form submission started', { formData: data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', data);
      reset();
    } catch (error) {
      // Capture exception with Sentry
      captureException(error as Error, {
        context: 'form_submission',
        formData: data,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="container mx-auto p-6">
      <Flex direction="column" gap="6" className="max-w-2xl mx-auto">
        {/* Radix UI Themes Components */}
        <Box>
          <Heading size="8" mb="2">
            Typed Component Example
          </Heading>
          <Text size="3" color="gray">
            This page demonstrates proper TypeScript typing with all integrations
          </Text>
        </Box>

        {/* shadcn/ui Card Component */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>
              Fill out the form below with full type safety
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...register('name')}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <Text size="1" color="red">
                    {errors.name.message}
                  </Text>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <Text size="1" color="red">
                    {errors.email.message}
                  </Text>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter your message"
                  {...register('message')}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <Text size="1" color="red">
                    {errors.message.message}
                  </Text>
                )}
              </div>

              <Flex gap="3" align="center">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                <Badge variant="outline">
                  Form is {Object.keys(errors).length === 0 ? 'valid' : 'invalid'}
                </Badge>
              </Flex>
            </form>
          </CardContent>
        </Card>

        {/* Example of typed props usage */}
        <TypedButtonExample />
        <RadixThemeExample />
      </Flex>
    </Box>
  );
}

// Example component with typed props
function TypedButtonExample() {
  const buttonProps: ButtonProps = {
    variant: 'outline',
    size: 'lg',
    onClick: () => console.log('Typed button clicked'),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Typed Button Props</CardTitle>
      </CardHeader>
      <CardContent>
        <Button {...buttonProps}>
          Click me - I'm fully typed!
        </Button>
      </CardContent>
    </Card>
  );
}

// Example with Radix UI Themes typed props
function RadixThemeExample() {
  const flexProps: FlexProps = {
    direction: 'column',
    gap: '4',
    align: 'center',
  };

  const textProps: TextProps = {
    size: '5',
    weight: 'bold',
    color: 'blue',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Radix UI Themes Typography</CardTitle>
      </CardHeader>
      <CardContent>
        <Flex {...flexProps}>
          <Text {...textProps}>
            This text uses typed Radix UI props
          </Text>
          <Text size="2" color="gray">
            With full TypeScript support and autocompletion
          </Text>
        </Flex>
      </CardContent>
    </Card>
  );
}

// Example of React 19 Server Component type
export const PreloadedData: ServerComponent = async () => {
  // This would be a server component in React 19
  const data = await fetch('https://api.example.com/data');
  return <div>Server loaded data</div>;
};

// Example of React 19 Async Component
export const AsyncDataLoader: AsyncFC<{ id: string }> = async ({ id }) => {
  // This component can be async in React 19
  const data = await fetch(`https://api.example.com/items/${id}`);
  return <div>Async loaded item</div>;
};