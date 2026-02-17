import HookDocPage from '../../../components/HookDocPage';

export default function UseFormPage() {
  return (
    <HookDocPage
      title="useForm"
      description="A form state management hook that provides reactive values, validation, touched tracking, submission handling, and optional persistence via FormProvider. Designed to wire directly into @kayou/ui form components via fieldError() and fieldColor() helpers."
      parameters={[
        {
          name: 'id',
          type: 'string',
          description:
            'Stable identifier for persistence via FormProvider. When set, form values are auto-saved and restored across mounts.',
        },
        {
          name: 'initialValues',
          type: 'T extends Record<string, unknown>',
          description:
            'Initial field values. Defines the form shape and infers field types.',
          required: true,
        },
        {
          name: 'onSubmit',
          type: '(values: T) => void | Partial<Record<keyof T, string>> | Promise<...>',
          description:
            'Called on successful validation. Can return field errors (e.g. from server) which are merged into the errors store. Thrown errors are captured in submitError.',
          required: true,
        },
        {
          name: 'validate',
          type: '(values: T) => Partial<Record<keyof T, string>>',
          description:
            'Validation function. Returns an object mapping field names to error strings. Return an empty object if all fields are valid.',
        },
        {
          name: 'validateOn',
          type: '"submit" | "blur" | "change"',
          description:
            'When to run validation. "submit" (default): only on form submission. "blur": on field blur and submission. "change": on every value change and submission.',
        },
      ]}
      returnType="UseFormReturn<T>"
      returns={[
        {
          name: 'values',
          type: 'T',
          description:
            'Reactive store of current form values. Access fields as form.values.email.',
        },
        {
          name: 'errors',
          type: 'Partial<Record<keyof T, string>>',
          description:
            'Reactive store of all validation errors (including untouched fields).',
        },
        {
          name: 'touched',
          type: 'Record<keyof T, boolean>',
          description: 'Reactive store of touched state per field.',
        },
        {
          name: 'handleChange',
          type: '(name: keyof T) => (e: Event) => void',
          description:
            'Returns an onInput handler. Auto-detects input type: reads checked for checkboxes, valueAsNumber for number/range, value for text.',
        },
        {
          name: 'handleBlur',
          type: '(name: keyof T) => () => void',
          description:
            'Returns an onBlur handler. Marks the field as touched and validates if validateOn is "blur".',
        },
        {
          name: 'handleSubmit',
          type: '(e?: Event) => Promise<void>',
          description:
            'Submit handler. Touches all fields, validates, and calls onSubmit if valid. Catches thrown errors into submitError.',
        },
        {
          name: 'fieldError',
          type: '(name: keyof T) => string | undefined',
          description:
            'Returns the error message for a field, but only if touched. Pass to helperText prop.',
        },
        {
          name: 'fieldColor',
          type: '(name: keyof T) => "failure" | "gray"',
          description:
            'Returns "failure" if the field has a visible error, otherwise "gray". Pass to color prop.',
        },
        {
          name: 'isSubmitting',
          type: '() => boolean',
          description: 'True while onSubmit is executing.',
        },
        {
          name: 'submitError',
          type: '() => Error | null',
          description:
            'Error thrown by onSubmit. Null when no error. Cleared on each new submission and on reset().',
        },
        {
          name: 'isDirty',
          type: '() => boolean',
          description:
            'True if any field value differs from its initialValues counterpart. Uses deep comparison for objects/arrays.',
        },
        {
          name: 'isValid',
          type: '() => boolean',
          description: 'True if validation passes and the errors store has no entries.',
        },
        {
          name: 'reset',
          type: '() => void',
          description:
            'Resets values, errors, touched, and submitError to initial states. Clears persisted data if using FormProvider.',
        },
        {
          name: 'setValue',
          type: '(name: keyof T, value: T[keyof T]) => void',
          description:
            'Programmatically set a field value. Use for Select, DatePicker, UploadFile, ToggleSwitch, etc.',
        },
        {
          name: 'setTouched',
          type: '(name: keyof T, isTouched?: boolean) => void',
          description:
            'Programmatically mark a field as touched. Call alongside setValue for components without blur events.',
        },
        {
          name: 'setErrors',
          type: '(errors: Partial<Record<keyof T, string>>) => void',
          description:
            'Set multiple field errors at once (e.g. server-side errors). Merges into existing errors.',
        },
        {
          name: 'setFieldError',
          type: '(name: keyof T, error: string | undefined) => void',
          description:
            'Set or clear a single field error. Pass undefined to clear.',
        },
        {
          name: 'validateField',
          type: '(name: keyof T) => void',
          description: 'Run validation for a single field and update the errors store.',
        },
        {
          name: 'validateForm',
          type: '() => Partial<Record<keyof T, string>>',
          description:
            'Run full form validation and update the errors store. Returns the errors object.',
        },
      ]}
      usage={`
        import { useForm } from '@kayou/hooks';
        import { Form, TextInput, Select, UploadFile, Button } from '@kayou/ui';
        import type { ExistingFile } from '@kayou/ui';

        function ProfileForm() {
          const form = useForm({
            initialValues: {
              name: '',
              role: '',
              avatar: [] as ExistingFile[],
            },
            validate: (values) => {
              const errors: Partial<Record<string, string>> = {};
              if (!values.name) errors.name = 'Name is required';
              if (!values.role) errors.role = 'Select a role';
              return errors;
            },
            onSubmit: async (values) => {
              const res = await api.updateProfile(values);
              if (res.fieldErrors) return res.fieldErrors;
            },
            validateOn: 'blur',
          });

          return (
            <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
              <TextInput
                label="Name"
                value={form.values.name}
                onInput={form.handleChange('name')}
                onBlur={form.handleBlur('name')}
                color={form.fieldColor('name')}
                helperText={form.fieldError('name')}
              />
              <Select
                options={[{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }]}
                value={form.values.role}
                onSelect={(o) => { form.setValue('role', o?.value ?? ''); form.setTouched('role'); }}
                color={form.fieldColor('role')}
                helperText={form.fieldError('role')}
              />
              <UploadFile
                value={form.values.avatar}
                onChange={(file) => form.setValue('avatar', file)}
                onRemove={(file) => form.setValue('avatar',
                  form.values.avatar.filter((f) => f.id !== file.id)
                )}
                accept="image/*"
                helperText={form.fieldError('avatar')}
              />
              <Show when={form.submitError()}>
                <p class="text-sm text-red-600">{form.submitError()!.message}</p>
              </Show>
              <Button type="submit" disabled={form.isSubmitting()}>
                Save
              </Button>
            </Form>
          );
        }
      `}
    />
  );
}
