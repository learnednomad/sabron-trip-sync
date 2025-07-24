// React 19 Type Enhancements and Compatibility Types

import type * as React from 'react';

// React 19 Server Component Types
export type ServerComponent<P = {}> = (props: P) => Promise<React.ReactElement> | React.ReactElement;
export type ClientComponent<P = {}> = React.FC<P>;

// React 19 Use Hook Types
export type UsePromise<T> = T extends Promise<infer U> ? U : T;

// React 19 Actions
export type ServerAction<T = void> = (formData: FormData) => Promise<T>;
export type ClientAction<T = void> = (formData: FormData) => void | Promise<T>;

// React 19 Form Types
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  action?: string | ServerAction | ClientAction;
}

// React 19 Optimistic State Types
export type OptimisticStateUpdater<T> = (currentState: T, optimisticValue: T) => T;

// React 19 Transition Types
export interface TransitionOptions {
  name?: string;
}

// React 19 Cache Types
export type CacheScope = 'request' | 'preload' | 'render';

// React 19 RSC Payload Types
export interface RSCPayload {
  [key: string]: any;
}

// React 19 Streaming Types
export interface StreamingOptions {
  progressive?: boolean;
  signal?: AbortSignal;
}

// React 19 Error Boundary Types
export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  onReset?: () => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  children: React.ReactNode;
}

// React 19 Suspense Types
export interface SuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  unstable_avoidThisFallback?: boolean;
}

// React 19 Context Types
export interface ContextProviderProps<T> {
  value: T;
  children: React.ReactNode;
}

// React 19 Component Props Types
export type PropsWithServerContext<P = {}> = P & {
  serverContext?: Record<string, any>;
};

// React 19 Ref Types
export type RefCallback<T> = (instance: T | null) => void;
export type RefObject<T> = React.MutableRefObject<T | null>;

// React 19 Event Types
export interface FormEvent<T = Element> extends React.SyntheticEvent<T> {
  currentTarget: EventTarget & T;
  formData?: FormData;
}

// React 19 Children Types
export type ReactNodeArray = Array<React.ReactNode>;
export type ReactFragment = Iterable<React.ReactNode>;

// React 19 Element Types
export interface ReactElement<
  P = any,
  T extends string | React.JSXElementConstructor<any> = string | React.JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: React.Key | null;
}

// React 19 Portal Types
export interface ReactPortal extends React.ReactElement {
  key: React.Key | null;
  children: React.ReactNode;
}

// React 19 Lazy Component Types
export interface LazyExoticComponent<T extends React.ComponentType<any>>
  extends React.ExoticComponent<React.ComponentPropsWithRef<T>> {
  readonly _result: T;
}

// React 19 Memo Component Types
export interface MemoExoticComponent<T extends React.ComponentType<any>>
  extends React.NamedExoticComponent<React.ComponentPropsWithRef<T>> {
  readonly type: T;
}

// React 19 Forward Ref Types
export interface ForwardRefExoticComponent<P> extends React.NamedExoticComponent<P> {
  defaultProps?: Partial<P>;
  propTypes?: React.WeakValidationMap<P>;
}

// React 19 Provider Types
export interface Provider<T> extends React.ExoticComponent<ContextProviderProps<T>> {
  propTypes?: React.WeakValidationMap<ContextProviderProps<T>>;
}

// React 19 Consumer Types
export interface Consumer<T> extends React.ExoticComponent<React.ConsumerProps<T>> {
  propTypes?: React.WeakValidationMap<React.ConsumerProps<T>>;
}

// React 19 Hook Types
export type DependencyList = ReadonlyArray<any>;
export type EffectCallback = () => void | (() => void);

// React 19 State Types
export type StateUpdater<S> = S | ((prevState: S) => S);
export type Dispatch<A> = (value: A) => void;
export type DispatchWithoutAction = () => void;

// React 19 Reducer Types
export type Reducer<S, A> = (prevState: S, action: A) => S;
export type ReducerWithoutAction<S> = (prevState: S) => S;

// React 19 Callback Types
export type CallbackFunction = (...args: any[]) => any;

// React 19 Ref Forwarding Types
export type Ref<T> = RefCallback<T> | RefObject<T> | null;
export type LegacyRef<T> = string | Ref<T>;

// React 19 Key Types
export type Key = string | number | bigint;

// React 19 Props Types
export interface Attributes {
  key?: Key | null;
}

export interface RefAttributes<T> extends Attributes {
  ref?: Ref<T>;
}

export interface ClassAttributes<T> extends RefAttributes<T> {
  key?: Key | null;
}

// React 19 HTML Types
export interface HTMLProps<T> extends React.AllHTMLAttributes<T>, React.ClassAttributes<T> {}

// React 19 SVG Types
export interface SVGProps<T> extends React.SVGAttributes<T>, React.ClassAttributes<T> {}

// React 19 DOM Types
export interface DOMAttributes<T> {
  children?: React.ReactNode;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
}

// React 19 Style Types
export interface CSSProperties extends React.CSSProperties {
  [key: `--${string}`]: string | number;
}

// React 19 Event Handler Types
export type EventHandler<E extends React.SyntheticEvent<any>> = (event: E) => void;

export type ReactEventHandler<T = Element> = EventHandler<React.SyntheticEvent<T>>;

export type ClipboardEventHandler<T = Element> = EventHandler<React.ClipboardEvent<T>>;
export type CompositionEventHandler<T = Element> = EventHandler<React.CompositionEvent<T>>;
export type DragEventHandler<T = Element> = EventHandler<React.DragEvent<T>>;
export type FocusEventHandler<T = Element> = EventHandler<React.FocusEvent<T>>;
export type FormEventHandler<T = Element> = EventHandler<FormEvent<T>>;
export type ChangeEventHandler<T = Element> = EventHandler<React.ChangeEvent<T>>;
export type KeyboardEventHandler<T = Element> = EventHandler<React.KeyboardEvent<T>>;
export type MouseEventHandler<T = Element> = EventHandler<React.MouseEvent<T>>;
export type TouchEventHandler<T = Element> = EventHandler<React.TouchEvent<T>>;
export type PointerEventHandler<T = Element> = EventHandler<React.PointerEvent<T>>;
export type UIEventHandler<T = Element> = EventHandler<React.UIEvent<T>>;
export type WheelEventHandler<T = Element> = EventHandler<React.WheelEvent<T>>;
export type AnimationEventHandler<T = Element> = EventHandler<React.AnimationEvent<T>>;
export type TransitionEventHandler<T = Element> = EventHandler<React.TransitionEvent<T>>;

// Async Component Types for React 19
export type AsyncFC<P = {}> = (props: P) => Promise<React.ReactElement | null>;
export type AsyncComponent<P = {}> = AsyncFC<P> | ServerComponent<P>;