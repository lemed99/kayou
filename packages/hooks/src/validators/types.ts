/**
 * A validator function that checks a single field value.
 * Returns an error message string if invalid, or undefined if valid.
 */
export type FieldValidator = (value: unknown) => string | undefined;

/**
 * Maps field names to arrays of validator functions.
 * Validators run in order; the first error wins (short-circuit per field).
 */
export type FormSchema<T extends Record<string, unknown>> = Partial<{
  [K in keyof T]: FieldValidator[];
}>;
