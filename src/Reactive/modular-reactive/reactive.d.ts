/**
 * TypeScript Definitions for DOM Helpers Reactive Library
 * 
 * Complete type safety for:
 * - 01_dh-reactive.js
 * - 02_dh-reactive-array-patch.js
 * - 03_dh-reactive-collections.js
 * - 04_dh-reactive-form.js
 * - 05_dh-reactive-cleanup.js
 * - 06_dh-reactive-enhancements.js
 * 
 * @version 2.0.0
 */

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Symbol to get raw (non-reactive) object
 */
export const RAW: unique symbol;

/**
 * Symbol to check if object is reactive
 */
export const IS_REACTIVE: unique symbol;

/**
 * Extract the raw type from a reactive object
 */
export type Raw<T> = T extends { [RAW]: infer R } ? R : T;

/**
 * Check if a type is reactive
 */
export type IsReactive<T> = T extends { [IS_REACTIVE]: true } ? true : false;

// ============================================================================
// REACTIVE STATE
// ============================================================================

/**
 * A reactive state object with methods for managing reactivity
 */
export interface ReactiveState<T extends object> {
  // Original properties (reactive)
  [K in keyof T]: T[K];
  
  // Computed property
  $computed<Key extends string, Fn extends (this: ReactiveState<T>) => any>(
    key: Key,
    fn: Fn
  ): ReactiveState<T> & Record<Key, ReturnType<Fn>>;
  
  // Watch for changes
  $watch<K extends keyof T>(
    key: K,
    callback: (newValue: T[K], oldValue: T[K]) => void
  ): () => void;
  
  $watch<R>(
    fn: (this: ReactiveState<T>) => R,
    callback: (newValue: R, oldValue: R) => void
  ): () => void;
  
  // Batch multiple updates
  $batch<R>(fn: (this: ReactiveState<T>) => R): R;
  
  // Manually trigger updates
  $notify(key?: keyof T): void;
  
  // Get raw object
  readonly $raw: T;
  
  // Update multiple properties (state + DOM)
  $update(updates: Partial<T> & Record<string, any>): this;
  
  // Set with functional updates
  $set(updates: {
    [K in keyof T]?: T[K] | ((prev: T[K]) => T[K])
  }): this;
  
  // Create reactive bindings
  $bind(bindings: BindingDefinitions): () => void;
  
  // Clean up all tracking
  $cleanup(): void;
}

/**
 * Binding definitions for DOM elements
 */
export type BindingDefinitions = Record<string, BindingValue>;

export type BindingValue = 
  | string 
  | (() => any)
  | Record<string, string | (() => any)>;

// ============================================================================
// REF
// ============================================================================

/**
 * A reactive reference to a single value
 */
export interface Ref<T> extends ReactiveState<{ value: T }> {
  value: T;
  valueOf(): T;
  toString(): string;
}

// ============================================================================
// COLLECTION
// ============================================================================

/**
 * A reactive collection (list) with array-like methods
 */
export interface ReactiveCollection<T> extends ReactiveState<{ items: T[] }> {
  items: T[];
  
  // Add item
  add(item: T): this;
  
  // Remove item
  remove(predicate: T | ((item: T, index: number) => boolean)): this;
  
  // Update item
  update(
    predicate: T | ((item: T, index: number) => boolean),
    updates: Partial<T>
  ): this;
  
  // Clear all items
  clear(): this;
  
  // Find item
  find(predicate: T | ((item: T, index: number) => boolean)): T | undefined;
  
  // Filter items
  filter(predicate: (item: T, index: number) => boolean): T[];
  
  // Map items
  map<U>(fn: (item: T, index: number) => U): U[];
  
  // For each item
  forEach(fn: (item: T, index: number) => void): this;
  
  // Sort items
  sort(compareFn?: (a: T, b: T) => number): this;
  
  // Reverse items
  reverse(): this;
  
  // Array-like properties
  readonly length: number;
  readonly first: T | undefined;
  readonly last: T | undefined;
  
  // Access by index
  at(index: number): T | undefined;
  
  // Check if contains
  includes(item: T): boolean;
  
  // Get index
  indexOf(item: T): number;
  
  // Slice
  slice(start?: number, end?: number): T[];
  
  // Splice
  splice(start: number, deleteCount: number, ...items: T[]): this;
  
  // Push
  push(...items: T[]): this;
  
  // Pop
  pop(): T | undefined;
  
  // Shift
  shift(): T | undefined;
  
  // Unshift
  unshift(...items: T[]): this;
  
  // Toggle property
  toggle(
    predicate: T | ((item: T, index: number) => boolean),
    field?: keyof T
  ): this;
  
  // Remove where condition is true
  removeWhere(predicate: (item: T, index: number) => boolean): this;
  
  // Update where condition is true
  updateWhere(
    predicate: (item: T, index: number) => boolean,
    updates: Partial<T>
  ): this;
  
  // Reset to new items
  reset(items?: T[]): this;
  
  // Convert to array
  toArray(): T[];
  
  // Check if empty
  isEmpty(): boolean;
}

// ============================================================================
// FORM
// ============================================================================

/**
 * A reactive form with validation
 */
export interface ReactiveForm<T extends Record<string, any>> extends ReactiveState<{
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  submitCount: number;
}> {
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  submitCount: number;
  
  // Computed properties
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly hasErrors: boolean;
  readonly touchedFields: (keyof T)[];
  readonly errorFields: (keyof T)[];
  
  // Set field value
  setValue<K extends keyof T>(field: K, value: T[K]): this;
  
  // Set multiple values
  setValues(values: Partial<T>): this;
  
  // Set field error
  setError<K extends keyof T>(field: K, error: string | null): this;
  
  // Set multiple errors
  setErrors(errors: Partial<Record<keyof T, string | null>>): this;
  
  // Clear error
  clearError<K extends keyof T>(field: K): this;
  
  // Clear all errors
  clearErrors(): this;
  
  // Mark field as touched
  setTouched<K extends keyof T>(field: K, touched?: boolean): this;
  
  // Mark multiple fields as touched
  setTouchedFields(fields: (keyof T)[]): this;
  
  // Mark all as touched
  touchAll(): this;
  
  // Validate field
  validateField<K extends keyof T>(field: K): boolean;
  
  // Validate all fields
  validate(): boolean;
  
  // Reset form
  reset(newValues?: Partial<T>): this;
  
  // Reset single field
  resetField<K extends keyof T>(field: K): this;
  
  // Submit form
  submit(handler?: FormSubmitHandler<T>): Promise<FormSubmitResult<T>>;
  
  // Handle input change
  handleChange(event: Event): void;
  
  // Handle input blur
  handleBlur(event: Event): void;
  
  // Get field props for binding
  getFieldProps<K extends keyof T>(field: K): FieldProps;
  
  // Check if field has error
  hasError<K extends keyof T>(field: K): boolean;
  
  // Check if field is touched
  isTouched<K extends keyof T>(field: K): boolean;
  
  // Get field error
  getError<K extends keyof T>(field: K): string | null;
  
  // Get field value
  getValue<K extends keyof T>(field: K): T[K];
  
  // Should show error?
  shouldShowError<K extends keyof T>(field: K): boolean;
  
  // Bind to DOM inputs
  bindToInputs(selector: string | NodeList): this;
  
  // Convert to plain object
  toObject(): FormState<T>;
}

export type FormSubmitHandler<T> = (
  values: T,
  form: ReactiveForm<T>
) => any | Promise<any>;

export interface FormSubmitResult<T> {
  success: boolean;
  result?: any;
  errors?: Partial<Record<keyof T, string | null>>;
  error?: Error;
}

export interface FieldProps {
  name: string;
  value: any;
  onChange: (event: Event) => void;
  onBlur: (event: Event) => void;
}

export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string | null>>;
  touched: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  submitCount: number;
}

/**
 * Form validators
 */
export type Validator<T = any> = (value: T, allValues?: any) => string | null;

export interface Validators {
  required(message?: string): Validator<any>;
  email(message?: string): Validator<string>;
  minLength(min: number, message?: string): Validator<string>;
  maxLength(max: number, message?: string): Validator<string>;
  pattern(regex: RegExp, message?: string): Validator<string>;
  min(min: number, message?: string): Validator<number>;
  max(max: number, message?: string): Validator<number>;
  match(fieldName: string, message?: string): Validator<any>;
  custom<T>(fn: Validator<T>): Validator<T>;
  combine<T>(...validators: Validator<T>[]): Validator<T>;
}

// ============================================================================
// ASYNC STATE
// ============================================================================

/**
 * A reactive state for async operations
 */
export interface ReactiveAsyncState<T> extends ReactiveState<{
  data: T | null;
  loading: boolean;
  error: Error | null;
  requestId: number;
}> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  requestId: number;
  
  // Computed
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly isIdle: boolean;
  
  // Execute async function
  $execute(fn: (signal: AbortSignal) => Promise<T>): Promise<AsyncResult<T>>;
  
  // Abort current request
  $abort(): void;
  
  // Reset state
  $reset(): void;
  
  // Refetch
  $refetch(): Promise<AsyncResult<T>> | undefined;
}

export interface AsyncResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  stale?: boolean;
  aborted?: boolean;
}

export interface AsyncStateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

// ============================================================================
// STORE
// ============================================================================

/**
 * A reactive store with getters and actions
 */
export interface ReactiveStore<
  T extends object,
  G extends Record<string, any> = {},
  A extends Record<string, any> = {}
> extends ReactiveState<T> {
  // Computed getters
  [K in keyof G]: G[K];
  
  // Actions
  [K in keyof A]: A[K];
}

export interface StoreOptions<T extends object> {
  getters?: Record<string, (this: ReactiveState<T>) => any>;
  actions?: Record<string, (state: ReactiveState<T>, ...args: any[]) => any>;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * A reactive component
 */
export interface ReactiveComponent<T extends object> extends ReactiveState<T> {
  $destroy(): void;
}

export interface ComponentConfig<T extends object> {
  state?: T;
  computed?: Record<string, (this: ReactiveState<T>) => any>;
  watch?: Record<string, (newValue: any, oldValue: any) => void>;
  effects?: Record<string, (this: ReactiveState<T>) => void>;
  bindings?: BindingDefinitions;
  actions?: Record<string, (state: ReactiveState<T>, ...args: any[]) => any>;
  mounted?: (this: ReactiveState<T>) => void;
  unmounted?: (this: ReactiveState<T>) => void;
}

// ============================================================================
// REACTIVE BUILDER
// ============================================================================

/**
 * A fluent builder for reactive objects
 */
export interface ReactiveBuilder<T extends object> {
  state: ReactiveState<T>;
  
  computed(definitions: Record<string, (this: ReactiveState<T>) => any>): this;
  watch(definitions: Record<string, (newValue: any, oldValue: any) => void>): this;
  effect(fn: (this: ReactiveState<T>) => void): this;
  bind(definitions: BindingDefinitions): this;
  action<K extends string, F extends (state: ReactiveState<T>, ...args: any[]) => any>(
    name: K,
    fn: F
  ): this;
  actions(definitions: Record<string, (state: ReactiveState<T>, ...args: any[]) => any>): this;
  build(): ReactiveState<T> & { destroy(): void };
  destroy(): void;
}

// ============================================================================
// CLEANUP
// ============================================================================

/**
 * Cleanup collector for managing multiple cleanups
 */
export interface CleanupCollector {
  add(cleanup: () => void): this;
  cleanup(): void;
  readonly size: number;
  readonly disposed: boolean;
}

/**
 * Cleanup API
 */
export interface ReactiveCleanup {
  getStats(): {
    message: string;
    note: string;
  };
  
  collector(): CleanupCollector;
  
  scope(fn: (collect: (cleanup: () => void) => void) => void): () => void;
  
  patchState<T extends object>(state: ReactiveState<T>): ReactiveState<T>;
  
  isActive(effectFn: Function): boolean;
  
  debug(enable?: boolean): this;
  
  test(): void;
}

// ============================================================================
// ENHANCEMENTS
// ============================================================================

/**
 * Priority levels for effect scheduling
 */
export enum Priority {
  COMPUTED = 1,
  WATCH = 2,
  EFFECT = 3
}

/**
 * Error boundary for effects
 */
export interface ErrorBoundaryOptions {
  onError?: (error: Error, context: ErrorContext) => void;
  fallback?: (error: Error, context: ErrorContext) => any;
  retry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ErrorContext {
  type: string;
  [key: string]: any;
}

export class ErrorBoundary {
  constructor(options?: ErrorBoundaryOptions);
  wrap<T extends (...args: any[]) => any>(fn: T, context?: ErrorContext): T;
}

/**
 * DevTools for debugging
 */
export interface DevTools {
  enabled: boolean;
  
  enable(): void;
  disable(): void;
  
  trackState(state: any, name?: string): void;
  trackEffect(effect: Function, name?: string): void;
  
  logChange(state: any, key: string, oldValue: any, newValue: any): void;
  
  getStates(): Array<{
    id: number;
    name: string;
    created: number;
    state: any;
  }>;
  
  getHistory(): Array<{
    stateId: number;
    stateName: string;
    key: string;
    oldValue: any;
    newValue: any;
    timestamp: number;
  }>;
  
  clearHistory(): void;
}

/**
 * Enhancements API
 */
export interface ReactiveEnhancements {
  batch<T>(fn: () => T): T;
  queueUpdate(fn: () => void, priority?: Priority): void;
  
  safeEffect(fn: () => void, options?: { errorBoundary?: ErrorBoundaryOptions }): () => void;
  safeWatch<T extends object, K extends keyof T>(
    state: ReactiveState<T>,
    key: K,
    callback: (newValue: T[K], oldValue: T[K]) => void,
    options?: { errorBoundary?: ErrorBoundaryOptions }
  ): () => void;
  
  asyncEffect(
    fn: (signal: AbortSignal) => void | Promise<void | (() => void)>,
    options?: { onError?: (error: Error) => void }
  ): () => void;
  
  asyncState<T>(
    initialValue?: T | null,
    options?: AsyncStateOptions<T>
  ): ReactiveAsyncState<T>;
  
  ErrorBoundary: typeof ErrorBoundary;
  DevTools: DevTools;
  PRIORITY: typeof Priority;
}

// ============================================================================
// MAIN API
// ============================================================================

/**
 * Main ReactiveUtils API
 */
export interface ReactiveUtils {
  // Create reactive state
  state<T extends object>(target: T): ReactiveState<T>;
  
  // Create state with bindings
  createState<T extends object>(
    initialState: T,
    bindings?: BindingDefinitions
  ): ReactiveState<T>;
  
  // Update all (state + DOM)
  updateAll<T extends object>(
    state: ReactiveState<T>,
    updates: Partial<T> & Record<string, any>
  ): ReactiveState<T>;
  
  // Add computed properties
  computed<T extends object>(
    state: ReactiveState<T>,
    definitions: Record<string, (this: ReactiveState<T>) => any>
  ): ReactiveState<T>;
  
  // Add watchers
  watch<T extends object>(
    state: ReactiveState<T>,
    definitions: Record<string, (newValue: any, oldValue: any) => void>
  ): () => void;
  
  // Create effect
  effect(fn: () => void | (() => void)): () => void;
  
  // Create multiple effects
  effects(definitions: Record<string, () => void>): () => void;
  
  // Create ref
  ref<T>(value: T): Ref<T>;
  
  // Create multiple refs
  refs<T extends Record<string, any>>(
    definitions: T
  ): { [K in keyof T]: Ref<T[K]> };
  
  // Create store
  store<T extends object>(
    initialState: T,
    options?: StoreOptions<T>
  ): ReactiveStore<T>;
  
  // Create component
  component<T extends object>(
    config: ComponentConfig<T>
  ): ReactiveComponent<T>;
  
  // Create reactive builder
  reactive<T extends object>(initialState: T): ReactiveBuilder<T>;
  
  // Create bindings
  bindings(definitions: BindingDefinitions): () => void;
  
  // Create collection/list
  list<T>(items?: T[]): ReactiveCollection<T>;
  collection<T>(items?: T[]): ReactiveCollection<T>;
  
  // Create form
  form<T extends Record<string, any>>(
    initialValues?: T,
    options?: {
      validators?: Partial<Record<keyof T, Validator>>;
      onSubmit?: FormSubmitHandler<T>;
    }
  ): ReactiveForm<T>;
  createForm<T extends Record<string, any>>(
    initialValues?: T,
    options?: {
      validators?: Partial<Record<keyof T, Validator>>;
      onSubmit?: FormSubmitHandler<T>;
    }
  ): ReactiveForm<T>;
  
  // Validators
  validators: Validators;
  
  // Create async state
  async<T>(initialValue?: T | null): ReactiveAsyncState<T>;
  
  // Batch updates
  batch<T>(fn: () => T): T;
  
  // Utilities
  isReactive(value: any): boolean;
  toRaw<T>(value: T): Raw<T>;
  notify<T extends object>(state: ReactiveState<T>, key?: keyof T): void;
  pause(): void;
  resume(flush?: boolean): void;
  untrack<T>(fn: () => T): T;
  
  // Cleanup
  cleanup: ReactiveCleanup;
  collector(): CleanupCollector;
  scope(fn: (collect: (cleanup: () => void) => void) => void): () => void;
  
  // Enhancements
  safeEffect(fn: () => void, options?: { errorBoundary?: ErrorBoundaryOptions }): () => void;
  safeWatch<T extends object>(
    state: ReactiveState<T>,
    keyOrFn: keyof T | ((this: ReactiveState<T>) => any),
    callback: (newValue: any, oldValue: any) => void,
    options?: { errorBoundary?: ErrorBoundaryOptions }
  ): () => void;
  asyncEffect(
    fn: (signal: AbortSignal) => void | Promise<void | (() => void)>,
    options?: { onError?: (error: Error) => void }
  ): () => void;
  asyncState<T>(
    initialValue?: T | null,
    options?: AsyncStateOptions<T>
  ): ReactiveAsyncState<T>;
  ErrorBoundary: typeof ErrorBoundary;
  DevTools: DevTools;
}

// ============================================================================
// COLLECTIONS API
// ============================================================================

export interface Collections {
  create<T>(items?: T[]): ReactiveCollection<T>;
  createWithComputed<T>(
    items?: T[],
    computed?: Record<string, (this: ReactiveCollection<T>) => any>
  ): ReactiveCollection<T>;
  createFiltered<T>(
    collection: ReactiveCollection<T>,
    predicate: (item: T) => boolean
  ): ReactiveCollection<T>;
  collection<T>(items?: T[]): ReactiveCollection<T>;
  list<T>(items?: T[]): ReactiveCollection<T>;
}

// ============================================================================
// FORMS API
// ============================================================================

export interface Forms {
  create<T extends Record<string, any>>(
    initialValues?: T,
    options?: {
      validators?: Partial<Record<keyof T, Validator>>;
      onSubmit?: FormSubmitHandler<T>;
    }
  ): ReactiveForm<T>;
  form<T extends Record<string, any>>(
    initialValues?: T,
    options?: {
      validators?: Partial<Record<keyof T, Validator>>;
      onSubmit?: FormSubmitHandler<T>;
    }
  ): ReactiveForm<T>;
  validators: Validators;
  v: Validators;
}

// ============================================================================
// GLOBAL DECLARATIONS
// ============================================================================

declare global {
  interface Window {
    ReactiveUtils: ReactiveUtils;
    ReactiveState: {
      create<T extends object>(target: T): ReactiveState<T>;
      form<T extends Record<string, any>>(initialValues?: T): ReactiveForm<T>;
      async<T>(initialValue?: T | null): ReactiveAsyncState<T>;
      collection<T>(items?: T[]): ReactiveCollection<T>;
    };
    ReactiveCleanup: ReactiveCleanup;
    ReactiveEnhancements: ReactiveEnhancements;
    Collections: Collections;
    Forms: Forms;
    updateAll: typeof ReactiveUtils.prototype.updateAll;
    patchReactiveArray<T extends object>(state: ReactiveState<T>, key: keyof T): void;
    __REACTIVE_DEVTOOLS__?: DevTools;
  }
}

// ============================================================================
// MODULE EXPORTS
// ============================================================================

export const ReactiveUtils: ReactiveUtils;
export const ReactiveState: Window['ReactiveState'];
export const ReactiveCleanup: ReactiveCleanup;
export const ReactiveEnhancements: ReactiveEnhancements;
export const Collections: Collections;
export const Forms: Forms;

export default ReactiveUtils;