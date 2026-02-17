import DocPage from '../../../components/DocPage';

export default function FormPage() {
  return (
    <DocPage
      title="Form"
      description="Thin form wrapper that handles preventDefault, disables native browser validation, and sets aria-busy during submission. Use with useForm for complete form state management."
      dependencies={[]}
      relatedHooks={[
        {
          name: 'useForm',
          path: '/hooks/use-form',
          description:
            'Form state management hook that provides values, errors, touched tracking, validation, and submission handling. Pair with Form for the complete experience.',
        },
      ]}
      keyConcepts={[
        {
          term: 'Native Validation Disabled',
          explanation:
            'Sets noValidate automatically so form validation is handled entirely by useForm.',
        },
        {
          term: 'Accessible Submission State',
          explanation:
            'Applies aria-busy to the form element during submission for screen reader support.',
        },
        {
          term: 'Automatic preventDefault',
          explanation:
            'Prevents the default form submission behavior, so the page does not reload.',
        },
      ]}
      props={[
        {
          name: 'onSubmit',
          type: '(e: SubmitEvent) => void | Promise<void>',
          default: '-',
          description:
            'Submit handler. Typically pass form.handleSubmit from useForm.',
        },
        {
          name: 'isSubmitting',
          type: 'boolean',
          default: 'false',
          description:
            'Whether the form is currently submitting. Controls aria-busy.',
        },
      ]}
      playground={`
        import { Form, TextInput, Button } from '@kayou/ui';
        import { useForm } from '@kayou/hooks';

        export default function Example() {
          const form = useForm({
            initialValues: { name: '', email: '' },
            validate: (values) => {
              const errors = {};
              if (!values.name) errors.name = 'Name is required';
              if (!values.email) errors.email = 'Email is required';
              return errors;
            },
            onSubmit: async (values) => {
              alert('Submitted: ' + JSON.stringify(values));
            },
          });

          return (
            <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
              <div class="flex flex-col gap-4">
                <TextInput
                  label="Name"
                  value={form.values.name}
                  onInput={form.handleChange('name')}
                  onBlur={form.handleBlur('name')}
                  color={form.fieldColor('name')}
                  helperText={form.fieldError('name')}
                />
                <TextInput
                  label="Email"
                  value={form.values.email}
                  onInput={form.handleChange('email')}
                  onBlur={form.handleBlur('email')}
                  color={form.fieldColor('email')}
                  helperText={form.fieldError('email')}
                />
                <Button type="submit" disabled={form.isSubmitting()}>
                  Submit
                </Button>
              </div>
            </Form>
          );
        }
      `}
      usage={`
        import { Form } from '@kayou/ui';
        import { useForm } from '@kayou/hooks';

        const form = useForm({ ... });

        <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
          {/* form fields */}
        </Form>
      `}
    />
  );
}
