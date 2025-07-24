import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';

// Button Component Types
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof import('@/components/ui/button').buttonVariants> {
  asChild?: boolean;
}

// Card Component Types
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Input Component Types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Label Component Types
export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof import('@/components/ui/label').labelVariants> {}

// Select Component Types
export interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: 'ltr' | 'rtl';
  name?: string;
  disabled?: boolean;
  required?: boolean;
}

// Dialog Component Types
export interface DialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// Form Component Types (React Hook Form)
export interface FormFieldContextValue<
  TFieldValues extends Record<string, any> = Record<string, any>,
  TName extends keyof TFieldValues = keyof TFieldValues
> {
  name: TName;
}

export interface FormItemContextValue {
  id: string;
}

// Avatar Component Types
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

// Badge Component Types
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof import('@/components/ui/badge').badgeVariants> {}

// Skeleton Component Types
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

// Toast Component Types
export interface ToastProps extends React.ComponentPropsWithoutRef<'li'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onSwipeStart?: (event: React.PointerEvent) => void;
  onSwipeMove?: (event: React.PointerEvent) => void;
  onSwipeEnd?: (event: React.PointerEvent) => void;
  onSwipeCancel?: (event: React.PointerEvent) => void;
  forceMount?: true;
}

export interface ToastActionElement {
  altText: string;
  action: React.ReactElement;
}

// Dropdown Menu Component Types
export interface DropdownMenuProps {
  children?: React.ReactNode;
  dir?: 'ltr' | 'rtl';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// Command Component Types
export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  onValueChange?: (value: string) => void;
  filter?: (value: string, search: string) => number;
  label?: string;
  shouldFilter?: boolean;
  loop?: boolean;
}

// Popover Component Types
export interface PopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// Sheet Component Types
export interface SheetProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

// Tabs Component Types
export interface TabsProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  activationMode?: 'automatic' | 'manual';
}

// Toggle Component Types
export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof import('@/components/ui/toggle').toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  asChild?: boolean;
}

// Calendar Component Types
export interface CalendarProps {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from: Date; to?: Date };
  onSelect?: (date: Date | Date[] | { from: Date; to?: Date } | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  initialFocus?: boolean;
  className?: string;
  classNames?: Record<string, string>;
  showOutsideDays?: boolean;
}

// Carousel Component Types
export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: any; // Embla carousel options
  orientation?: 'horizontal' | 'vertical';
  setApi?: (api: any) => void;
}

// Drawer Component Types (Vaul)
export interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  shouldScaleBackground?: boolean;
  modal?: boolean;
  direction?: 'top' | 'bottom' | 'left' | 'right';
  dismissible?: boolean;
}

// Separator Component Types
export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
}

// Progress Component Types
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  getValueLabel?: (value: number, max: number) => string;
}

// Scroll Area Component Types
export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'auto' | 'always' | 'scroll' | 'hover';
  scrollbarSize?: number;
  scrollHideDelay?: number;
  dir?: 'ltr' | 'rtl';
}