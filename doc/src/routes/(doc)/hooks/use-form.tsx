import HookDocPage from '../../../components/HookDocPage';

export default function UseFormPage() {
  return (
    <HookDocPage
      title="useForm"
      description="A form state management hook that provides reactive values, validation, touched tracking, submission handling, optional persistence via FormProvider, and exact dotted-path support for nested form fields like units.0.name. Designed to wire directly into @kayou/ui form components via fieldError(), fieldColor(), fieldErrorAt(), and fieldColorAt()."
      parameters={[
        {
          name: 'id',
          type: 'string',
          description:
            'Stable identifier for persistence via FormProvider. When set, form values are auto-saved in a batched way and restored across mounts.',
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
          type: '(values: T) => void | Record<string, string | undefined> | Promise<...>',
          description:
            'Called on successful validation. Can return field errors (e.g. from server) which are merged into the errors store. Thrown errors are captured in submitError.',
          required: true,
        },
        {
          name: 'schema',
          type: 'Partial<{ [K in keyof T]: FieldValidator[] }>',
          description:
            'Per-field validation schema. Maps field names to arrays of composable validator functions (e.g. required(), email(), minLength()). Validators run in order, stopping at the first error per field. Access built-in validators via useForm.validators.',
        },
        {
          name: 'validate',
          type: '(values: T) => Record<string, string | undefined>',
          description:
            'Form-level validation function for cross-field rules. Returns an object mapping top-level fields and dotted nested paths to error strings. When both schema and validate are provided, schema runs first, then validate errors merge on top.',
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
          name: 'setValues',
          type: 'SetStoreFunction<T>',
          description:
            "Low-level Solid store setter for advanced updates and exact path writes such as form.setValues('units', 0, 'name', 'kg'). This returned setter is persistence-aware and still participates in draft saving when id is enabled.",
        },
        {
          name: 'replaceAllValues',
          type: '(nextValues: T) => void',
          description:
            'Replace the entire values store at once. Useful when loading a full draft or resetting a nested structure while preserving the same useForm helpers.',
        },
        {
          name: 'errors',
          type: 'Partial<Record<keyof T, string>>',
          description:
            'Reactive store of top-level validation errors (including untouched fields). Dotted nested errors are read through fieldErrorAt().',
        },
        {
          name: 'touched',
          type: 'Record<keyof T, boolean>',
          description: 'Reactive store of touched state per top-level field.',
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
          name: 'handleChangeAt',
          type: '(...path: FormPath) => (e: Event) => void',
          description:
            'Returns an onInput handler for an exact nested path such as handleChangeAt("units", index, "name").',
        },
        {
          name: 'handleBlurAt',
          type: '(...path: FormPath) => () => void',
          description:
            'Returns an onBlur handler for an exact nested path. Marks that path as touched and validates it when validateOn is "blur".',
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
          name: 'fieldErrorAt',
          type: '(path: FormPath) => string | undefined',
          description:
            'Returns the visible error for an exact nested path such as ["units", 0, "name"].',
        },
        {
          name: 'fieldColorAt',
          type: '(path: FormPath) => "failure" | "gray"',
          description:
            'Returns "failure" if an exact nested path has a visible error, otherwise "gray".',
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
          name: 'setTouchedAt',
          type: '(path: FormPath, isTouched?: boolean) => void',
          description:
            'Programmatically mark an exact nested path as touched or untouched.',
        },
        {
          name: 'setErrors',
          type: '(errors: Record<string, string | undefined>) => void',
          description:
            'Set multiple field errors at once (e.g. server-side errors). Merges into existing errors and supports dotted keys such as units.0.name.',
        },
        {
          name: 'setFieldError',
          type: '(name: keyof T, error: string | undefined) => void',
          description:
            'Set or clear a single field error. Pass undefined to clear. Advanced fields like Password can use this to own their own validation and still report errors through useForm.',
        },
        {
          name: 'setFieldErrorAt',
          type: '(path: FormPath, error: string | undefined) => void',
          description: 'Set or clear a single exact nested-path error.',
        },
        {
          name: 'validateField',
          type: '(name: keyof T) => void',
          description: 'Run validation for a single field and update the errors store.',
        },
        {
          name: 'validateFieldAt',
          type: '(path: FormPath) => void',
          description:
            'Run validation for an exact nested path and refresh only that dotted-path error entry.',
        },
        {
          name: 'validateForm',
          type: '() => Record<string, string | undefined>',
          description:
            'Run full form validation and update both top-level and dotted nested errors. Returns the merged errors object.',
        },
      ]}
      provider={{
        name: 'FormProvider',
        required: false,
        description:
          'Wrap your app or page in FormProvider to opt into sessionStorage-based persistence. Forms with an id prop will auto-save values, restore them when remounted, and clear persisted drafts after reset() or a successful submit. Without FormProvider, useForm works normally but does not persist.',
        props: [
          {
            name: 'storageKey',
            type: 'string',
            default: '-',
            description:
              'Namespace for sessionStorage. All forms within this provider store under the key "forms:{storageKey}". Use different keys for different pages or scopes.',
            required: true,
          },
        ],
        example: `
          import { FormProvider } from '@kayou/hooks';
          import { useForm } from '@kayou/hooks';
          import { Form, TextInput, Button } from '@kayou/ui';

          // Wrap your page/app once
          function App() {
            return (
              <FormProvider storageKey="my-app">
                <ContactForm />
              </FormProvider>
            );
          }

          // Forms with an id will auto-persist
          function ContactForm() {
            const form = useForm({
              id: 'contact',  // enables persistence
              initialValues: { name: '', message: '' },
              schema: {
                name: [useForm.validators.required()],
              },
              onSubmit: async (values) => {
                await api.sendMessage(values);
                // On success, persisted data is automatically cleared
              },
            });

            return (
              <Form onSubmit={form.handleSubmit}>
                <TextInput
                  label="Name"
                  value={form.values.name}
                  onInput={form.handleChange('name')}
                  onBlur={form.handleBlur('name')}
                  color={form.fieldColor('name')}
                  helperText={form.fieldError('name')}
                />
                <TextInput
                  label="Message"
                  value={form.values.message}
                  onInput={form.handleChange('message')}
                  onBlur={form.handleBlur('message')}
                />
                <Button type="submit">Send</Button>
              </Form>
            );
          }
        `,
      }}
      usage={`
        import { Show } from 'solid-js';
        import { useForm } from '@kayou/hooks';
        import { Form, TextInput, Select, UploadFile, Password, Button } from '@kayou/ui';
        import type { ExistingFile } from '@kayou/ui';

        function ProfileForm() {
          const form = useForm({
            initialValues: {
              name: '',
              role: '',
              password: '',
              avatar: [] as ExistingFile[],
              units: [{ name: '', conversion_factor: 1, is_reference: true }],
            },
            validate: (values) => {
              const errors: Record<string, string | undefined> = {};
              if (!values.name) errors.name = 'Name is required';
              if (!values.role) errors.role = 'Select a role';
              if (!values.units[0]?.name.trim()) errors['units.0.name'] = 'Unit name is required';
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
              <Password
                label="Password"
                name="password"
                form={form}
                requiredStrength="strong"
                showStrength
                showRequirements
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
              <TextInput
                label="Unit name"
                value={form.values.units[0].name}
                onInput={form.handleChangeAt('units', 0, 'name')}
                onBlur={form.handleBlurAt('units', 0, 'name')}
                color={form.fieldColorAt(['units', 0, 'name'])}
                helperText={form.fieldErrorAt(['units', 0, 'name'])}
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
