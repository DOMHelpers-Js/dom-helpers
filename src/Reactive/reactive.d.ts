/**
 * TypeScript Definitions for DOM Helpers Reactive Library + AutoSave
 * 
 * Complete type safety for:
 * - 01_dh-reactive.js
 * - 02_dh-reactive-array-patch.js
 * - 03_dh-reactive-collections.js
 * - 04_dh-reactive-form.js
 * - 05_dh-reactive-cleanup.js
 * - 06_dh-reactive-enhancements.js
 * - 10_dh-reactive-storage-standalone.js (autoSave)
 * 
 * @version 3.0.0
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
  
  add(item: T): this;
  remove(predicate: T | ((item: T, index: number) => boolean)): this;
  update(predicate: T | ((item: T, index: number) => boolean), updates: Partial<T>): this;
  clear(): this;
  find(predicate: T | ((item: T, index: number) => boolean)): T | undefined;
  filter(predicate: (item: T, index: number) => boolean): T[];
  map<U>(fn: (item: T, index: number) => U): U[];
  forEach(fn: (item: T, index: number) => void): this;
  sort(compareFn?: (a: T, b: T) => number): this;
  reverse(): this;
  
  readonly length: number;
  readonly first: T | undefined;
  readonly last: T | undefined;
  
  at(index: number): T | undefined;
  includes(item: T): boolean;
  indexOf(item: T): number;
  slice(start?: number, end?: number): T[];
  splice(start: number, deleteCount: number, ...items: T[]): this;
  push(...items: T[]): this;
  pop(): T | undefined;
  shift(): T | undefined;
  unshift(...items: T[]): this;
  toggle(predicate: T | ((item: T, index: number) => boolean), field?: keyof T): this;
  removeWhere(predicate: (item: T, index: number) => boolean): this;
  updateWhere(predicate: (item: T, index: number) => boolean, updates: Partial<T>): this;
  reset(items?: T[]): this;
  toArray(): T[];
  isEmpty(): boolean;
}

// ============================================================================
// FORM
// ============================================================================

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
  
  readonly isValid: boolean;
  readonly isDirty: boolean;
  readonly hasErrors: boolean;
  readonly touchedFields: (keyof T)[];
  readonly errorFields: (keyof T)[];
  
  setValue<K extends keyof T>(field: K, value: T[K]): this;
  setValues(values: Partial<T>): this;
  setError<K extends keyof T>(field: K, error: string | null): this;
  setErrors(errors: Partial<Record<keyof T, string | null>>): this;
  clearError<K extends keyof T>(field: K): this;
  clearErrors(): this;
  setTouched<K extends keyof T>(field: K, touched?: boolean): this;
  setTouchedFields(fields: (keyof T)[]): this;
  touchAll(): this;
  validateField<K extends keyof T>(field: K): boolean;
  validate(): boolean;
  reset(newValues?: Partial<T>): this;
  resetField<K extends keyof T>(field: K): this;
  submit(handler?: FormSubmitHandler<T>): Promise<FormSubmitResult<T>>;
  handleChange(event: Event): void;
  handleBlur(event: Event): void;
  getFieldProps<K extends keyof T>(field: K): FieldProps;
  hasError<K extends keyof T>(field: K): boolean;
  isTouched<K extends keyof T>(field: K): boolean;
  getError<K extends keyof T>(field: K): string | null;
  getValue<K extends keyof T>(field: K): T[K];
  shouldShowError<K extends keyof T>(field: K): boolean;
  bindToInputs(selector: string | NodeList): this;
  toObject(): FormState<T>;
}

// ============================================================================
// ASYNC STATE
// ============================================================================

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
  
  readonly isSuccess: boolean;
  readonly isError: boolean;
  readonly isIdle: boolean;
  
  $execute(fn: (signal: AbortSignal) => Promise<T>): Promise<AsyncResult<T>>;
  $abort(): void;
  $reset(): void;
  $refetch(): Promise<AsyncResult<T>> | undefined;
}

// ============================================================================
// STORE
// ============================================================================

export interface StoreOptions<T extends object> {
  getters?: Record<string, (this: ReactiveState<T>) => any>;
  actions?: Record<string, (state: ReactiveState<T>, ...args: any[]) => any>;
}

export interface ReactiveStore<
  T extends object,
  G extends Record<string, any> = {},
  A extends Record<string, any> = {}
> extends ReactiveState<T> {
  [K in keyof G]: G[K];
  [K in keyof A]: A[K];
}

// ============================================================================
// COMPONENT
// ============================================================================

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

export interface ReactiveComponent<T extends object> extends ReactiveState<T> {
  $destroy(): void;
}

// ============================================================================
// REACTIVE BUILDER
// ============================================================================

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

export interface CleanupCollector {
  add(cleanup: () => void): this;
  cleanup(): void;
  readonly size: number;
  readonly disposed: boolean;
}

export interface ReactiveCleanup {
  getStats(): { message: string; note: string };
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

export enum Priority {
  COMPUTED = 1,
  WATCH = 2,
  EFFECT = 3
}

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
// AUTO-SAVE STORAGE (NEW!)
// ============================================================================

/**
 * Storage types
 */
export type StorageType = 'localStorage' | 'sessionStorage';

/**
 * Error contexts for storage operations
 */
export type StorageErrorContext = 
  | 'save' 
  | 'load' 
  | 'sync' 
  | 'quota' 
  | 'getValue' 
  | 'setValue';

/**
 * AutoSave options
 */
export interface AutoSaveOptions {
  /** Storage type */
  storage?: StorageType;
  
  /** Namespace for keys */
  namespace?: string;
  
  /** Debounce time in milliseconds */
  debounce?: number;
  
  /** Auto-load on creation */
  autoLoad?: boolean;
  
  /** Auto-save on changes */
  autoSave?: boolean;
  
  /** Enable cross-tab sync */
  sync?: boolean;
  
  /** Expiration time in seconds */
  expires?: number;
  
  /** Transform before saving */
  onSave?: (data: any) => any;
  
  /** Transform after loading */
  onLoad?: (data: any) => any;
  
  /** Called when synced from another tab */
  onSync?: (data: any) => void;
  
  /** Error handler */
  onError?: (error: Error, context: StorageErrorContext) => void;
}

/**
 * Storage methods added to reactive objects
 */
export interface StorageMethods {
  /** Force save immediately */
  $save(): boolean;
  
  /** Reload from storage */
  $load(): boolean;
  
  /** Remove from storage */
  $clear(): boolean;
  
  /** Check if exists in storage */
  $exists(): boolean;
  
  /** Stop auto-saving */
  $stopAutoSave(): this;
  
  /** Resume auto-saving */
  $startAutoSave(): this;
  
  /** Cleanup all listeners */
  $destroy(): void;
  
  /** Get storage info */
  $storageInfo(): StorageInfo;
}

/**
 * Storage info returned by $storageInfo()
 */
export interface StorageInfo {
  key: string;
  namespace: string;
  storage: StorageType;
  exists: boolean;
  size: number;
  sizeKB: number;
  error?: string;
}

/**
 * Reactive object with storage methods
 */
export type WithStorage<T> = T & StorageMethods;

/**
 * AutoSave function type
 */
export interface AutoSaveFunction {
  <T extends object>(
    reactiveObj: ReactiveState<T>,
    key: string,
    options?: AutoSaveOptions
  ): WithStorage<ReactiveState<T>>;
  
  <T>(
    reactiveObj: Ref<T>,
    key: string,
    options?: AutoSaveOptions
  ): WithStorage<Ref<T>>;
  
  <T>(
    reactiveObj: ReactiveCollection<T>,
    key: string,
    options?: AutoSaveOptions
  ): WithStorage<ReactiveCollection<T>>;
  
  <T extends Record<string, any>>(
    reactiveObj: ReactiveForm<T>,
    key: string,
    options?: AutoSaveOptions
  ): WithStorage<ReactiveForm<T>>;
}

/**
 * Reactive storage proxy
 */
export interface ReactiveStorageProxy {
  set(key: string, value: any, options?: { expires?: number }): boolean;
  get(key: string): any;
  remove(key: string): boolean;
  has(key: string): boolean;
  keys(): string[];
  clear(): boolean;
}

/**
 * Watch storage options
 */
export interface WatchStorageOptions {
  storage?: StorageType;
  namespace?: string;
  immediate?: boolean;
}

/**
 * Storage integration API
 */
export interface ReactiveStorageAPI {
  /** Add auto-save to any reactive object */
  autoSave: AutoSaveFunction;
  
  /** Create reactive storage */
  reactiveStorage(
    storageType?: StorageType,
    namespace?: string
  ): ReactiveStorageProxy;
  
  /** Watch a storage key */
  watch<T = any>(
    key: string,
    callback: (newValue: T | null, oldValue: T | null) => void,
    options?: WatchStorageOptions
  ): () => void;
  
  /** Backward compatibility */
  withStorage: AutoSaveFunction;
  
  /** Check storage availability */
  isStorageAvailable(type: StorageType): boolean;
  
  /** Storage availability flags */
  hasLocalStorage: boolean;
  hasSessionStorage: boolean;
}

// ============================================================================
// MAIN API
// ============================================================================

export interface ReactiveUtils {
  // State creation
  state<T extends object>(target: T): ReactiveState<T>;
  createState<T extends object>(
    initialState: T,
    bindings?: BindingDefinitions
  ): ReactiveState<T>;
  
  // Updates
  updateAll<T extends object>(
    state: ReactiveState<T>,
    updates: Partial<T> & Record<string, any>
  ): ReactiveState<T>;
  
  // Computed & Watch
  computed<T extends object>(
    state: ReactiveState<T>,
    definitions: Record<string, (this: ReactiveState<T>) => any>
  ): ReactiveState<T>;
  watch<T extends object>(
    state: ReactiveState<T>,
    definitions: Record<string, (newValue: any, oldValue: any) => void>
  ): () => void;
  
  // Effects
  effect(fn: () => void | (() => void)): () => void;
  effects(definitions: Record<string, () => void>): () => void;
  
  // Refs
  ref<T>(value: T): Ref<T>;
  refs<T extends Record<string, any>>(
    definitions: T
  ): { [K in keyof T]: Ref<T[K]> };
  
  // Collections
  list<T>(items?: T[]): ReactiveCollection<T>;
  collection<T>(items?: T[]): ReactiveCollection<T>;
  
  // Forms
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
  validators: Validators;
  
  // Store & Component
  store<T extends object>(
    initialState: T,
    options?: StoreOptions<T>
  ): ReactiveStore<T>;
  component<T extends object>(
    config: ComponentConfig<T>
  ): ReactiveComponent<T>;
  
  // Builder
  reactive<T extends object>(initialState: T): ReactiveBuilder<T>;
  bindings(definitions: BindingDefinitions): () => void;
  
  // Async
  async<T>(initialValue?: T | null): ReactiveAsyncState<T>;
  
  // Utilities
  batch<T>(fn: () => T): T;
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
  
  // Storage (NEW!)
  autoSave: AutoSaveFunction;
  reactiveStorage(storageType?: StorageType, namespace?: string): ReactiveStorageProxy;
  watchStorage<T = any>(
    key: string,
    callback: (newValue: T | null, oldValue: T | null) => void,
    options?: WatchStorageOptions
  ): () => void;
  withStorage: AutoSaveFunction; // Backward compat
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
    // Core
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
    
    // Storage (NEW!)
    ReactiveStorage: ReactiveStorageAPI;
    
    // Utility functions
    updateAll<T extends object>(
      state: ReactiveState<T>,
      updates: Partial<T> & Record<string, any>
    ): ReactiveState<T>;
    patchReactiveArray<T extends object>(state: ReactiveState<T>, key: keyof T): void;
    
    // Global shortcuts (if shortcut module loaded)
    state: typeof ReactiveUtils.prototype.state;
    ref: typeof ReactiveUtils.prototype.ref;
    collection: typeof ReactiveUtils.prototype.collection;
    form: typeof ReactiveUtils.prototype.form;
    effect: typeof ReactiveUtils.prototype.effect;
    
    // AutoSave shortcuts (NEW!)
    autoSave: AutoSaveFunction;
    reactiveStorage: ReactiveStorageAPI['reactiveStorage'];
    watchStorage: ReactiveStorageAPI['watch'];
    
    // DevTools
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
export const ReactiveStorage: ReactiveStorageAPI;

// AutoSave exports
export const autoSave: AutoSaveFunction;
export const reactiveStorage: ReactiveStorageAPI['reactiveStorage'];
export const watchStorage: ReactiveStorageAPI['watch'];

export default ReactiveUtils;