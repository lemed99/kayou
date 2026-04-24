import { createMemo, createSignal } from 'solid-js';
import {
  type SetStoreFunction,
  createStore,
  produce,
  reconcile,
  unwrap,
} from 'solid-js/store';

import { useFormContext } from '../context/FormContext';
import type { FormSchema } from '../validators';
import {
  email,
  max,
  maxArrayLength,
  maxLength,
  min,
  minArrayLength,
  minLength,
  pattern,
  required,
} from '../validators';

export type FormPath = readonly (string | number)[];

type FormKey<T extends Record<string, unknown>> = Extract<keyof T, string>;

type FormErrors<T extends Record<string, unknown>> = Partial<Record<FormKey<T>, string>>;

type FormErrorMap = Record<string, string | undefined>;

type SubmitValidator<T extends Record<string, unknown>> = (values: T) => FormErrorMap;

/**
 * Options for configuring the useForm hook.
 *
 * @template T - The shape of form values, inferred from initialValues
 */
export interface UseFormOptions<T extends Record<string, unknown>> {
  /**
   * Stable identifier for this form. Required for persistence via FormProvider.
   * Must be unique among forms within the same FormProvider scope.
   * When omitted, form values are not persisted.
   */
  id?: string;

  /** Initial field values. Defines the form shape and infers field types. */
  initialValues: T;

  /**
   * Per-field validation schema. Maps field names to arrays of validator
   * functions that run in order, stopping at the first error per field.
   *
   * When both `schema` and `validate` are provided, schema validators run
   * first, then `validate` errors merge on top (overriding schema errors
   * for the same field).
   */
  schema?: FormSchema<T>;

  /**
   * Form-level validation function. Receives all current values and returns
   * an object mapping top-level and dotted nested field names to error strings
   * for invalid fields. Return an empty object (or omit fields) if validation
   * passes.
   */
  validate?: (values: T) => FormErrorMap;

  /**
   * Called on successful validation with the current form values.
   * The form sets `isSubmitting` to true while this runs.
   *
   * Can return field errors (e.g. from a server response) which will be
   * merged into the errors store and displayed via `fieldError()` or
   * `fieldErrorAt()`.
   */
  onSubmit: (values: T) => void | FormErrorMap | Promise<void | FormErrorMap>;

  /**
   * When to run validation.
   * - `'submit'` — only on form submission (default)
   * - `'blur'` — on field blur and on submission
   * - `'change'` — on every value change and on submission
   * @default 'submit'
   */
  validateOn?: 'submit' | 'blur' | 'change';
}

/**
 * Return value of the useForm hook.
 *
 * @template T - The shape of form values
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Reactive store of current form values. Access fields as `form.values.email`. */
  values: T;

  /** Low-level Solid store setter for advanced path updates such as `setValues('units', 0, 'name', 'kg')`. */
  setValues: SetStoreFunction<T>;

  /** Replace store value with a new one. */
  replaceAllValues: (nextValues: T) => void;

  /** Reactive store of top-level validation errors (including untouched fields). */
  errors: FormErrors<T>;

  /** Reactive store of touched state per top-level field. */
  touched: Record<FormKey<T>, boolean>;

  /**
   * Returns an `onInput` handler for the given field.
   * Reads `e.currentTarget.value` for text inputs, or `e.currentTarget.checked`
   * for checkboxes, and updates the store.
   */
  handleChange: <K extends FormKey<T>>(name: K) => (e: Event) => void;

  /**
   * Returns an `onInput` handler for an exact nested path.
   * Example: `handleChangeAt('units', index, 'name')`.
   */
  handleChangeAt: (...path: FormPath) => (e: Event) => void;

  /**
   * Returns an `onBlur` handler for the given field.
   * Marks the field as touched. Validates the field if `validateOn` is `'blur'`.
   */
  handleBlur: <K extends FormKey<T>>(name: K) => () => void;

  /** Returns an `onBlur` handler for an exact nested path. */
  handleBlurAt: (...path: FormPath) => () => void;

  /**
   * Submit handler. Pass to `<Form onSubmit={...}>` or call directly.
   * Touches all fields, runs validation, and calls `onSubmit` if valid.
   */
  handleSubmit: (e?: Event) => Promise<void>;

  /**
   * Returns the error message for a field, but only if the field has been touched.
   * Returns `undefined` if untouched or if there is no error.
   */
  fieldError: <K extends FormKey<T>>(name: K) => string | undefined;

  /** Returns the visible error for an exact nested path such as `['units', 0, 'name']`. */
  fieldErrorAt: (path: FormPath) => string | undefined;

  /**
   * Returns `'failure'` if the field has a visible error (touched + has error),
   * otherwise `'gray'`. Pass directly to the `color` prop of form components.
   */
  fieldColor: <K extends FormKey<T>>(name: K) => 'failure' | 'gray';

  /** Returns `'failure'` if an exact nested path has a visible error, otherwise `'gray'`. */
  fieldColorAt: (path: FormPath) => 'failure' | 'gray';

  /** `true` while `onSubmit` is executing. */
  isSubmitting: () => boolean;

  /** Error thrown by `onSubmit`. `null` when no error. Cleared on each new submission and on `reset()`. */
  submitError: () => Error | null;

  /** `true` if any field value differs from its `initialValues` counterpart. */
  isDirty: () => boolean;

  /** `true` if validation passes and the errors store has no entries. */
  isValid: () => boolean;

  /** Resets values, errors, and touched to their initial states. */
  reset: () => void;

  /**
   * Programmatically set a single field value.
   * Use for non-text inputs (Select, Checkbox, ToggleSwitch, DatePicker, etc.).
   * Validates the field if `validateOn` is `'change'`.
   */
  setValue: <K extends FormKey<T>>(name: K, value: T[K]) => void;

  /** Programmatically mark a field as touched (or untouched). */
  setTouched: <K extends FormKey<T>>(name: K, isTouched?: boolean) => void;

  /** Programmatically mark an exact nested path as touched (or untouched). */
  setTouchedAt: (path: FormPath, isTouched?: boolean) => void;

  /**
   * Set multiple field errors at once (e.g. server-side validation errors).
   * Merges into existing errors. Dotted keys such as `units.0.name` are supported.
   */
  setErrors: (errors: FormErrorMap) => void;

  /**
   * Set or clear a single field's error (e.g. a server-side error).
   * Pass `undefined` to clear.
   */
  setFieldError: <K extends FormKey<T>>(name: K, error: string | undefined) => void;

  /** Set or clear a single exact nested-path error. Pass `undefined` to clear. */
  setFieldErrorAt: (path: FormPath, error: string | undefined) => void;

  /** Run validation for a single field and update the errors store. */
  validateField: <K extends FormKey<T>>(name: K) => void;

  /** Run validation for an exact nested path and refresh only that dotted-path entry. */
  validateFieldAt: (path: FormPath) => void;

  /** Run full form validation and update the errors stores. Returns the merged errors object. */
  validateForm: () => FormErrorMap;

  /** Function to add external validator (Ex: Password input) to the validation process  */
  registerSubmitValidator: (key: string, validator: SubmitValidator<T>) => () => void;
}

/**
 * Hook for managing form state, validation, and submission.
 *
 * Provides reactive stores for values, errors, and touched state, along with
 * helpers to wire into existing form components (TextInput, Select, etc.).
 *
 * `schema` remains top-level only. Nested validation should be returned from
 * `validate(values)` using dotted keys such as `units.0.name`. Server-side
 * errors can use the same dotted-key format via `setErrors()`.
 *
 * @template T - The shape of form values, inferred from initialValues
 * @param options - Form configuration including initial values, validation, and submit handler
 * @returns Form state and helpers for wiring to components
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (values) => {
 *     const errors: Record<string, string | undefined> = {};
 *     if (!values.email) errors.email = 'Email is required';
 *     if (values.password.length < 8) errors.password = 'Min 8 characters';
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     const res = await api.login(values);
 *     // Return server field errors — they'll show via fieldError()
 *     if (res.fieldErrors) return res.fieldErrors;
 *   },
 *   validateOn: 'blur',
 * });
 *
 * <Form onSubmit={form.handleSubmit}>
 *   <TextInput
 *     label="Email"
 *     value={form.values.email}
 *     onInput={form.handleChange('email')}
 *     onBlur={form.handleBlur('email')}
 *     color={form.fieldColor('email')}
 *     helperText={form.fieldError('email')}
 *   />
 *   <Button type="submit" disabled={form.isSubmitting()}>
 *     Submit
 *   </Button>
 * </Form>
 * ```
 *
 * @example
 * ```tsx
 * const form = useForm({
 *   initialValues: {
 *     units: [{ name: '', conversion_factor: 1, is_reference: true }],
 *   },
 *   validate: (values) => {
 *     const errors: Record<string, string | undefined> = {};
 *     if (!values.units[0]?.name.trim()) {
 *       errors['units.0.name'] = 'Unit name is required';
 *     }
 *     return errors;
 *   },
 *   onSubmit: async (values) => {
 *     await api.save(values);
 *   },
 * });
 *
 * <TextInput
 *   value={form.values.units[0].name}
 *   onInput={form.handleChangeAt('units', 0, 'name')}
 *   onBlur={form.handleBlurAt('units', 0, 'name')}
 *   color={form.fieldColorAt(['units', 0, 'name'])}
 *   helperText={form.fieldErrorAt(['units', 0, 'name'])}
 * />
 * ```
 */
export function useForm<T extends Record<string, unknown>>(
  options: UseFormOptions<T>,
): UseFormReturn<T> {
  const validateOn = options.validateOn ?? 'submit';

  // --- Persistence (opt-in via options.id) ---

  const formId = options.id;
  const formCtx = useFormContext();

  const restoredValues = formId
    ? (formCtx?.get(formId) as Partial<T> | undefined)
    : undefined;
  const mergedInitial: T = restoredValues
    ? { ...options.initialValues, ...restoredValues }
    : { ...options.initialValues };

  // --- State ---

  const [values, setValues] = createStore<T>(mergedInitial);

  const initialTouched = Object.fromEntries(
    Object.keys(options.initialValues).map((k) => [k, false]),
  ) as Record<FormKey<T>, boolean>;

  const [touched, setTouched] = createStore<Record<FormKey<T>, boolean>>({
    ...initialTouched,
  });
  const [errors, setErrors] = createStore<FormErrors<T>>({});
  const [pathErrors, setPathErrors] = createStore<FormErrorMap>({});
  const [pathTouched, setPathTouched] = createStore<Record<string, boolean>>({});

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitError, setSubmitError] = createSignal<Error | null>(null);

  const submitValidators = new Map<string, SubmitValidator<T>>();

  // --- Form persistance helpers ---
  let persistScheduled = false;
  let persistVersion = 0;

  const persistNow = () => {
    if (!formId || !formCtx) return;
    formCtx.save(formId, unwrap(values) as Record<string, unknown>);
  };

  // Change to timeout based persist if writes are becoming to frequent
  const schedulePersist = () => {
    if (!formId || !formCtx || persistScheduled) return;

    persistScheduled = true;
    const scheduledVersion = persistVersion;
    queueMicrotask(() => {
      if (scheduledVersion !== persistVersion) return;
      persistScheduled = false;
      persistNow();
    });
  };

  const cancelScheduledPersist = () => {
    persistVersion += 1;
    persistScheduled = false;
  };

  // --- Helpers ---

  const getCurrentValues = (): T => unwrap(values) as T;

  const getInputValue = (e: Event): unknown => {
    const target = e.currentTarget as HTMLInputElement;

    if (target.type === 'checkbox') {
      return target.checked;
    }

    if (target.type === 'number' || target.type === 'range') {
      return target.valueAsNumber;
    }

    return target.value;
  };

  const getTopLevelName = (path: FormPath): FormKey<T> | undefined => {
    if (path.length !== 1 || typeof path[0] !== 'string') {
      return undefined;
    }

    return path[0] as FormKey<T>;
  };

  const pathToKey = (path: FormPath): string => path.map(String).join('.');

  const splitErrorMap = (allErrors: FormErrorMap) => {
    const nextErrors: FormErrors<T> = {};
    const nextPathErrors: FormErrorMap = {};

    for (const [key, error] of Object.entries(allErrors)) {
      if (error === undefined) continue;

      if (key.includes('.')) {
        nextPathErrors[key] = error;
        continue;
      }

      nextErrors[key as FormKey<T>] = error;
    }

    return { nextErrors, nextPathErrors };
  };

  const syncValidationState = (allErrors: FormErrorMap): FormErrorMap => {
    const { nextErrors, nextPathErrors } = splitErrorMap(allErrors);
    setErrors(reconcile(nextErrors));
    setPathErrors(reconcile(nextPathErrors));
    return allErrors;
  };

  /** Run schema validators for a single field. Returns the first error or undefined. */
  const runSchemaField = <K extends FormKey<T>>(name: K): string | undefined => {
    const fieldValidators = options.schema?.[name];
    if (!fieldValidators) return undefined;
    const value = values[name];
    for (const validator of fieldValidators) {
      const error = validator(value);
      if (error !== undefined) return error;
    }
    return undefined;
  };

  const runValidation = (): FormErrorMap => {
    const result: FormErrorMap = {};

    if (options.schema) {
      for (const key of Object.keys(options.schema)) {
        const error = runSchemaField(key as FormKey<T>);
        if (error !== undefined) {
          result[key] = error;
        }
      }
    }

    if (options.validate) {
      const crossErrors = options.validate(getCurrentValues());
      for (const [key, error] of Object.entries(crossErrors)) {
        if (error !== undefined) {
          result[key] = error;
        }
      }
    }

    return result;
  };

  const runSubmitValidators = (): FormErrorMap => {
    const result: FormErrorMap = {};
    const currentValues = getCurrentValues();

    for (const validator of submitValidators.values()) {
      const errors = validator(currentValues);

      for (const [key, error] of Object.entries(errors)) {
        if (error !== undefined) {
          result[key] = error;
        }
      }
    }

    return result;
  };

  const setValueAtPath = (path: FormPath, value: unknown): void => {
    (setValues as (...args: unknown[]) => void)(...path, value);
    schedulePersist();
  };

  const setTopLevelValue = <K extends FormKey<T>>(name: K, value: T[K]): void => {
    (setValues as (...args: unknown[]) => void)(name, value);
    schedulePersist();
  };

  const replaceAllValues = (nextValues: T): void => {
    setValues(reconcile(nextValues));
    schedulePersist();
  };

  const updateValues = (...args: unknown[]) => {
    (setValues as (...args: unknown[]) => void)(...args);
    schedulePersist();
  };

  const markAllNestedPathsTouched = (): void => {
    const nextTouched: Record<string, boolean> = {};

    const visit = (value: unknown, currentPath: (string | number)[]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => visit(item, [...currentPath, index]));
        return;
      }

      if (typeof value === 'object' && value !== null) {
        for (const [key, nestedValue] of Object.entries(value)) {
          visit(nestedValue, [...currentPath, key]);
        }
        return;
      }

      if (currentPath.length > 1) {
        nextTouched[pathToKey(currentPath)] = true;
      }
    };

    visit(getCurrentValues(), []);

    setPathTouched(
      produce((draft) => {
        for (const key of Object.keys(nextTouched)) {
          draft[key] = true;
        }
      }),
    );
  };

  // --- Validation ---

  const registerSubmitValidator = (
    key: string,
    validator: SubmitValidator<T>,
  ): (() => void) => {
    submitValidators.set(key, validator);

    return () => {
      submitValidators.delete(key);
    };
  };

  const validateForm = (): FormErrorMap => {
    return syncValidationState({
      ...runValidation(),
      ...runSubmitValidators(),
    });
  };

  const validateField = <K extends FormKey<T>>(name: K): void => {
    let fieldErr = runSchemaField(name);

    if (options.validate) {
      const allErrors = options.validate(getCurrentValues());
      const crossErr = allErrors[name as string];
      if (crossErr !== undefined) {
        fieldErr = crossErr;
      }
    }

    setErrors(
      produce((draft) => {
        (draft as Record<string, string | undefined>)[name as string] = fieldErr;
      }),
    );
  };

  const validateFieldAt = (path: FormPath): void => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      validateField(topLevelName);
      return;
    }

    const pathKey = pathToKey(path);
    const allErrors = runValidation();

    setPathErrors(
      produce((draft) => {
        draft[pathKey] = allErrors[pathKey];
      }),
    );
  };

  // --- Error setters ---

  const setFormErrors = (errs: FormErrorMap): void => {
    setErrors(
      produce((draft) => {
        for (const [key, value] of Object.entries(errs)) {
          if (key.includes('.')) continue;
          (draft as Record<string, string | undefined>)[key] = value;
        }
      }),
    );
    setPathErrors(
      produce((draft) => {
        for (const [key, value] of Object.entries(errs)) {
          if (!key.includes('.')) continue;
          draft[key] = value;
        }
      }),
    );
  };

  const setFieldError = <K extends FormKey<T>>(
    name: K,
    error: string | undefined,
  ): void => {
    setErrors(
      produce((draft) => {
        (draft as Record<string, string | undefined>)[name as string] = error;
      }),
    );
  };

  const setFieldErrorAt = (path: FormPath, error: string | undefined): void => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      setFieldError(topLevelName, error);
      return;
    }

    const pathKey = pathToKey(path);

    setPathErrors(
      produce((draft) => {
        draft[pathKey] = error;
      }),
    );
  };

  const clearFieldError = <K extends FormKey<T>>(name: K): void => {
    if (errors[name] !== undefined) {
      setFieldError(name, undefined);
    }
  };

  const clearFieldErrorAt = (path: FormPath): void => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      clearFieldError(topLevelName);
      return;
    }

    const pathKey = pathToKey(path);
    if (pathErrors[pathKey] !== undefined) {
      setFieldErrorAt(path, undefined);
    }
  };

  // --- Field helpers ---

  const fieldError = <K extends FormKey<T>>(name: K): string | undefined => {
    if (!touched[name]) return undefined;
    return errors[name];
  };

  const fieldErrorAt = (path: FormPath): string | undefined => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      return fieldError(topLevelName);
    }

    const pathKey = pathToKey(path);
    if (!pathTouched[pathKey]) return undefined;
    return pathErrors[pathKey];
  };

  const fieldColor = <K extends FormKey<T>>(name: K): 'failure' | 'gray' => {
    return fieldError(name) ? 'failure' : 'gray';
  };

  const fieldColorAt = (path: FormPath): 'failure' | 'gray' => {
    return fieldErrorAt(path) ? 'failure' : 'gray';
  };

  // --- Handlers ---

  const handleChange = <K extends FormKey<T>>(name: K) => {
    // Returns a stable handler — not a reactive derivation, so the lint rule doesn't apply
    // eslint-disable-next-line solid/reactivity
    return (e: Event) => {
      const newValue = getInputValue(e);
      setTopLevelValue(name, newValue as T[K]);

      if (validateOn === 'change') {
        setTouched(
          produce((draft) => {
            (draft as Record<string, boolean>)[name as string] = true;
          }),
        );
        validateField(name);
      } else {
        clearFieldError(name);
      }
    };
  };

  const handleChangeAt = (...path: FormPath) => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      return handleChange(topLevelName);
    }

    // Returns a stable handler — not a reactive derivation, so the lint rule doesn't apply
    // eslint-disable-next-line solid/reactivity
    return (e: Event) => {
      const newValue = getInputValue(e);
      setValueAtPath(path, newValue);

      if (validateOn === 'change') {
        setTouchedAt(path, true);
        validateFieldAt(path);
      } else {
        clearFieldErrorAt(path);
      }
    };
  };

  const handleBlur = <K extends FormKey<T>>(name: K) => {
    // Returns a stable handler — not a reactive derivation, so the lint rule doesn't apply
    // eslint-disable-next-line solid/reactivity
    return () => {
      setTouched(
        produce((draft) => {
          (draft as Record<string, boolean>)[name as string] = true;
        }),
      );

      if (validateOn === 'blur') {
        validateField(name);
      }
    };
  };

  const handleBlurAt = (...path: FormPath) => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      return handleBlur(topLevelName);
    }

    // Returns a stable handler — not a reactive derivation, so the lint rule doesn't apply
    // eslint-disable-next-line solid/reactivity
    return () => {
      setTouchedAt(path, true);

      if (validateOn === 'blur') {
        validateFieldAt(path);
      }
    };
  };

  const setValue = <K extends FormKey<T>>(name: K, value: T[K]): void => {
    setTopLevelValue(name, value);

    if (validateOn === 'change') {
      setTouched(
        produce((draft) => {
          (draft as Record<string, boolean>)[name as string] = true;
        }),
      );
      validateField(name);
    } else {
      clearFieldError(name);
    }
  };

  const setTouchedField = <K extends FormKey<T>>(name: K, isTouched = true): void => {
    setTouched(
      produce((draft) => {
        (draft as Record<string, boolean>)[name as string] = isTouched;
      }),
    );
  };

  const setTouchedAt = (path: FormPath, isTouched = true): void => {
    const topLevelName = getTopLevelName(path);
    if (topLevelName !== undefined) {
      setTouchedField(topLevelName, isTouched);
      return;
    }

    const pathKey = pathToKey(path);
    setPathTouched(
      produce((draft) => {
        draft[pathKey] = isTouched;
      }),
    );
  };

  const handleSubmit = async (e?: Event): Promise<void> => {
    if (e) e.preventDefault();

    // Touch all fields so all errors become visible
    setTouched(
      produce((draft) => {
        for (const key of Object.keys(options.initialValues)) {
          (draft as Record<string, boolean>)[key] = true;
        }
      }),
    );
    markAllNestedPathsTouched();

    const validationErrors = validateForm();
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== undefined,
    );

    if (hasErrors) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await options.onSubmit(getCurrentValues());

      // If onSubmit returns field errors (e.g. from a server response), apply them.
      const fieldErrors = result && typeof result === 'object' ? result : undefined;
      const hasFieldErrors =
        fieldErrors && Object.values(fieldErrors).some((value) => value !== undefined);

      if (hasFieldErrors) {
        setFormErrors(fieldErrors);
      } else if (formId) {
        cancelScheduledPersist();
        formCtx?.clear(formId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Computed ---

  const isDirty = createMemo((): boolean => {
    const init = options.initialValues;
    for (const key of Object.keys(init)) {
      const current = values[key as FormKey<T>];
      const initial = init[key as FormKey<T>];
      if (current !== initial) {
        // Fall back to deep comparison for objects/arrays
        if (
          typeof current === 'object' &&
          current !== null &&
          typeof initial === 'object' &&
          initial !== null
        ) {
          if (JSON.stringify(current) !== JSON.stringify(initial)) return true;
        } else {
          return true;
        }
      }
    }
    return false;
  });

  const isValid = createMemo((): boolean => {
    if (options.schema) {
      for (const key of Object.keys(options.schema)) {
        if (runSchemaField(key as FormKey<T>) !== undefined) return false;
      }
    }

    if (options.validate) {
      const result = options.validate(getCurrentValues());
      if (Object.values(result).some((error) => error !== undefined)) {
        return false;
      }
    }

    return (
      !Object.values(errors).some((error) => error !== undefined) &&
      !Object.values(pathErrors).some((error) => error !== undefined)
    );
  });

  // --- Reset ---

  const reset = (): void => {
    setValues(reconcile({ ...options.initialValues }));
    setTouched(reconcile({ ...initialTouched }));
    setErrors(reconcile({}));
    setPathErrors(reconcile({}));
    setPathTouched(reconcile({}));
    setSubmitError(null);
    if (formId) {
      cancelScheduledPersist();
      formCtx?.clear(formId);
    }
  };

  return {
    values,
    setValues: updateValues,
    replaceAllValues,
    errors,
    touched,
    handleChange,
    handleChangeAt,
    handleBlur,
    handleBlurAt,
    handleSubmit,
    fieldError,
    fieldErrorAt,
    fieldColor,
    fieldColorAt,
    isSubmitting,
    submitError,
    isDirty,
    isValid,
    reset,
    setValue,
    setTouched: setTouchedField,
    setTouchedAt,
    setErrors: setFormErrors,
    setFieldError,
    setFieldErrorAt,
    validateField,
    validateFieldAt,
    validateForm,
    registerSubmitValidator,
  };
}

/** Validators for use with the `schema` option. Access as `useForm.validators.required()`, etc. */
useForm.validators = {
  required,
  email,
  minLength,
  maxLength,
  min,
  max,
  pattern,
  maxArrayLength,
  minArrayLength,
} as const;
