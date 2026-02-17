import { createEffect, createSignal, on } from 'solid-js';
import { createStore, produce, reconcile } from 'solid-js/store';
import { useFormContext } from '../context/FormContext';

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
   * Form-level validation function. Receives all current values and returns
   * an object mapping field names to error strings for invalid fields.
   * Return an empty object (or omit fields) if validation passes.
   */
  validate?: (values: T) => Partial<Record<keyof T, string>>;

  /**
   * Called on successful validation with the current form values.
   * The form sets `isSubmitting` to true while this runs.
   *
   * Can return field errors (e.g. from a server response) which will be
   * merged into the errors store and displayed via `fieldError()`.
   */
  onSubmit: (
    values: T,
  ) =>
    | void
    | Partial<Record<keyof T, string>>
    | Promise<void | Partial<Record<keyof T, string>>>;

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

  /** Reactive store of all validation errors (including untouched fields). */
  errors: Partial<Record<keyof T, string>>;

  /** Reactive store of touched state per field. */
  touched: Record<keyof T, boolean>;

  /**
   * Returns an `onInput` handler for the given field.
   * Reads `e.currentTarget.value` for text inputs, or `e.currentTarget.checked`
   * for checkboxes, and updates the store.
   */
  handleChange: <K extends keyof T>(name: K) => (e: Event) => void;

  /**
   * Returns an `onBlur` handler for the given field.
   * Marks the field as touched. Validates the field if `validateOn` is `'blur'`.
   */
  handleBlur: <K extends keyof T>(name: K) => () => void;

  /**
   * Submit handler. Pass to `<Form onSubmit={...}>` or call directly.
   * Touches all fields, runs validation, and calls `onSubmit` if valid.
   */
  handleSubmit: (e?: Event) => Promise<void>;

  /**
   * Returns the error message for a field, but only if the field has been touched.
   * Returns `undefined` if untouched or if there is no error.
   */
  fieldError: <K extends keyof T>(name: K) => string | undefined;

  /**
   * Returns `'failure'` if the field has a visible error (touched + has error),
   * otherwise `'gray'`. Pass directly to the `color` prop of form components.
   */
  fieldColor: <K extends keyof T>(name: K) => 'failure' | 'gray';

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
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;

  /** Programmatically mark a field as touched (or untouched). */
  setTouched: <K extends keyof T>(name: K, isTouched?: boolean) => void;

  /**
   * Set multiple field errors at once (e.g. server-side validation errors).
   * Merges into existing errors — fields not in the object are left unchanged.
   */
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;

  /**
   * Set or clear a single field's error (e.g. a server-side error).
   * Pass `undefined` to clear.
   */
  setFieldError: <K extends keyof T>(
    name: K,
    error: string | undefined,
  ) => void;

  /** Run validation for a single field and update the errors store. */
  validateField: <K extends keyof T>(name: K) => void;

  /** Run full form validation and update the errors store. Returns the errors object. */
  validateForm: () => Partial<Record<keyof T, string>>;
}

/**
 * Hook for managing form state, validation, and submission.
 *
 * Provides reactive stores for values, errors, and touched state, along with
 * helpers to wire into existing form components (TextInput, Select, etc.).
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
 *     const errors: Partial<Record<string, string>> = {};
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
  ) as Record<keyof T, boolean>;

  const [touched, setTouched] = createStore<Record<keyof T, boolean>>({
    ...initialTouched,
  });

  const [errors, setErrors] = createStore<Partial<Record<keyof T, string>>>(
    {},
  );

  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitError, setSubmitError] = createSignal<Error | null>(null);

  // --- Auto-save to FormProvider ---

  if (formId && formCtx) {
    createEffect(
      on(
        () => ({ ...values }),
        (v) => formCtx.save(formId, v as Record<string, unknown>),
        { defer: !restoredValues },
      ),
    );
  }

  // --- Validation ---

  const validateForm = (): Partial<Record<keyof T, string>> => {
    if (!options.validate) {
      setErrors(reconcile({}));
      return {};
    }
    const result = options.validate({ ...values });
    setErrors(reconcile(result));
    return result;
  };

  const validateField = <K extends keyof T>(name: K): void => {
    if (!options.validate) return;
    const allErrors = options.validate({ ...values });
    const fieldErr = allErrors[name];
    setErrors(
      produce((draft) => {
        (draft as Record<string, string | undefined>)[name as string] =
          fieldErr;
      }),
    );
  };

  // --- Error setters ---

  const setFormErrors = (
    errs: Partial<Record<keyof T, string>>,
  ): void => {
    setErrors(
      produce((draft) => {
        for (const [key, value] of Object.entries(errs)) {
          (draft as Record<string, string | undefined>)[key] = value as
            | string
            | undefined;
        }
      }),
    );
  };

  const setFieldError = <K extends keyof T>(
    name: K,
    error: string | undefined,
  ): void => {
    setErrors(
      produce((draft) => {
        (draft as Record<string, string | undefined>)[name as string] = error;
      }),
    );
  };

  const clearFieldError = <K extends keyof T>(name: K): void => {
    if (errors[name] !== undefined) {
      setFieldError(name, undefined);
    }
  };

  // --- Field helpers ---

  const fieldError = <K extends keyof T>(name: K): string | undefined => {
    if (!touched[name]) return undefined;
    return errors[name];
  };

  const fieldColor = <K extends keyof T>(name: K): 'failure' | 'gray' => {
    return fieldError(name) ? 'failure' : 'gray';
  };

  // --- Handlers ---

  const handleChange = <K extends keyof T>(name: K) => {
    // Returns a stable handler — not a reactive derivation, so the lint rule doesn't apply
    // eslint-disable-next-line solid/reactivity
    return (e: Event) => {
      const target = e.currentTarget as HTMLInputElement;
      let newValue: unknown;
      if (target.type === 'checkbox') {
        newValue = target.checked;
      } else if (
        (target.type === 'number' || target.type === 'range') &&
        target.value !== ''
      ) {
        newValue = target.valueAsNumber;
      } else {
        newValue = target.value;
      }
      setValues(
        produce((draft) => {
          (draft as Record<string, unknown>)[name as string] = newValue;
        }),
      );

      if (validateOn === 'change') {
        setTouched(
          produce((draft) => {
            (draft as Record<string, boolean>)[name as string] = true;
          }),
        );
        validateField(name);
      } else {
        // Clear stale errors (e.g. server errors) when the user edits the field
        clearFieldError(name);
      }
    };
  };

  const handleBlur = <K extends keyof T>(name: K) => {
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

  const setValue = <K extends keyof T>(name: K, value: T[K]): void => {
    setValues(
      produce((draft) => {
        (draft as Record<string, unknown>)[name as string] = value;
      }),
    );

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

  const setTouchedField = <K extends keyof T>(
    name: K,
    isTouched = true,
  ): void => {
    setTouched(
      produce((draft) => {
        (draft as Record<string, boolean>)[name as string] = isTouched;
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

    const validationErrors = validateForm();
    const hasErrors = Object.keys(validationErrors).some(
      (k) => validationErrors[k as keyof T] !== undefined,
    );

    if (hasErrors) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await options.onSubmit({ ...values });

      // If onSubmit returns field errors (e.g. from server), apply them
      if (result && typeof result === 'object') {
        setFormErrors(result);
      } else if (formId) {
        formCtx?.clear(formId);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Computed ---

  const isDirty = (): boolean => {
    const init = options.initialValues;
    for (const key of Object.keys(init)) {
      const current = values[key as keyof T];
      const initial = init[key as keyof T];
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
  };

  const isValid = (): boolean => {
    if (options.validate) {
      const result = options.validate({ ...values });
      if (Object.keys(result).some((k) => result[k as keyof T] !== undefined)) {
        return false;
      }
    }
    // Also check the errors store for server-side / manually set errors
    return !Object.keys(errors).some(
      (k) => errors[k as keyof T] !== undefined,
    );
  };

  // --- Reset ---

  const reset = (): void => {
    setValues(reconcile({ ...options.initialValues }));
    setTouched(reconcile({ ...initialTouched }));
    setErrors(reconcile({}));
    setSubmitError(null);
    if (formId) formCtx?.clear(formId);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    fieldError,
    fieldColor,
    isSubmitting,
    submitError,
    isDirty,
    isValid,
    reset,
    setValue,
    setTouched: setTouchedField,
    setErrors: setFormErrors,
    setFieldError,
    validateField,
    validateForm,
  };
}
