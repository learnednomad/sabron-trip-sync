import type * as React from 'react';

// Radix UI Themes Component Types
export interface ThemeProps {
  children: React.ReactNode;
  appearance?: 'light' | 'dark' | 'inherit';
  accentColor?: 
    | 'gray' | 'gold' | 'bronze' | 'brown' | 'yellow' | 'amber' | 'orange'
    | 'tomato' | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum' | 'purple'
    | 'violet' | 'iris' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'jade'
    | 'green' | 'grass' | 'lime' | 'mint' | 'sky';
  grayColor?: 
    | 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand' | 'gold'
    | 'bronze' | 'brown' | 'yellow' | 'amber' | 'orange' | 'tomato'
    | 'red' | 'ruby' | 'crimson' | 'pink' | 'plum' | 'purple' | 'violet'
    | 'iris' | 'indigo' | 'blue' | 'cyan' | 'teal' | 'jade' | 'green'
    | 'grass' | 'lime' | 'mint' | 'sky';
  hasBackground?: boolean;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  scaling?: '90%' | '95%' | '100%' | '105%' | '110%';
  panelBackground?: 'solid' | 'translucent';
}

// Layout Components
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  display?: 'none' | 'inline' | 'inline-block' | 'block' | 'inline-flex' | 'flex' | 'inline-grid' | 'grid' | 'inline-table' | 'table';
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  width?: string | number;
  height?: string | number;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  m?: string | number;
  mx?: string | number;
  my?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
}

export interface FlexProps extends BoxProps {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string | number;
  gapX?: string | number;
  gapY?: string | number;
}

export interface GridProps extends BoxProps {
  columns?: string | number;
  rows?: string | number;
  flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: string | number;
  gapX?: string | number;
  gapY?: string | number;
}

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: '1' | '2' | '3' | '4';
  display?: 'none' | 'initial' | 'flex';
  align?: 'left' | 'center' | 'right';
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: '1' | '2' | '3' | '4';
  display?: 'none' | 'initial' | 'flex';
}

// Typography Components
export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: 'span' | 'div' | 'label' | 'p';
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: string;
  highContrast?: boolean;
  align?: 'left' | 'center' | 'right';
  trim?: 'normal' | 'start' | 'end' | 'both';
}

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  color?: string;
  highContrast?: boolean;
  align?: 'left' | 'center' | 'right';
  trim?: 'normal' | 'start' | 'end' | 'both';
}

// Component Types
export interface RadixButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: '1' | '2' | '3' | '4';
  variant?: 'classic' | 'solid' | 'soft' | 'surface' | 'outline' | 'ghost';
  color?: string;
  highContrast?: boolean;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  loading?: boolean;
}

export interface RadixBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: '1' | '2' | '3';
  variant?: 'solid' | 'soft' | 'surface' | 'outline';
  color?: string;
  highContrast?: boolean;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface RadixCardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: '1' | '2' | '3' | '4' | '5';
  variant?: 'surface' | 'classic' | 'ghost';
  asChild?: boolean;
}

export interface RadixCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: '1' | '2' | '3';
  color?: string;
  highContrast?: boolean;
  variant?: 'classic' | 'surface' | 'soft';
}

export interface RadixSelectProps {
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
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft' | 'ghost';
  color?: string;
  highContrast?: boolean;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface RadixTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft';
  color?: string;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface RadixTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft';
  color?: string;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface RadixSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: '1' | '2' | '3' | '4';
  color?: string;
  highContrast?: boolean;
  variant?: 'classic' | 'surface' | 'soft';
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

export interface RadixSliderProps {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  name?: string;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  inverted?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenThumbs?: number;
  size?: '1' | '2' | '3';
  variant?: 'classic' | 'surface' | 'soft';
  color?: string;
  highContrast?: boolean;
  radius?: 'none' | 'small' | 'medium' | 'large' | 'full';
}

// Dialog and Modal Types
export interface RadixDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface RadixAlertDialogProps extends RadixDialogProps {}

export interface RadixHoverCardProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}

export interface RadixPopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}

export interface RadixTooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  skipDelayDuration?: number;
  disableHoverableContent?: boolean;
}

// Table Types
export interface RadixTableProps extends React.HTMLAttributes<HTMLTableElement> {
  size?: '1' | '2' | '3';
  variant?: 'surface' | 'ghost';
}

// Additional Utility Types
export interface RadixThemePanelProps {
  defaultOpen?: boolean;
}

export interface RadixPortalProps {
  children?: React.ReactNode;
  container?: HTMLElement;
}

export interface RadixSlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

export interface RadixVisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

export interface RadixAccessibleIconProps {
  children?: React.ReactNode;
  label: string;
}