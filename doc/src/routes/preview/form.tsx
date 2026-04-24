import { type JSX, Show, createSignal } from 'solid-js';

import { useForm } from '@kayou/hooks';
import { Button, Form, Password, TextInput } from '@kayou/ui';

const v = useForm.validators;

/** Wrapper for each test section. */
function Section(props: { id: string; title: string; children: JSX.Element }) {
  return (
    <section id={props.id} class="mb-10 border-b border-neutral-200 pb-8">
      <h2 class="mb-4 text-lg font-semibold">{props.title}</h2>
      {props.children}
    </section>
  );
}

// ── 1. Basic submit (validate function, validateOn submit) ──────────

function BasicSubmit() {
  const [submitted, setSubmitted] = createSignal(false);

  const form = useForm({
    initialValues: { name: '', email: '' },
    validate: (values) => {
      const errors: Partial<Record<string, string>> = {};
      if (!values.name) errors.name = 'Name is required';
      if (!values.email) errors.email = 'Email is required';
      return errors;
    },
    onSubmit: () => {
      setSubmitted(true);
    },
  });

  return (
    <Section id="basic-submit" title="Basic Submit">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
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
          <Button type="submit">Submit</Button>
          <Show when={submitted()}>
            <p data-testid="basic-success">Form submitted successfully</p>
          </Show>
        </div>
      </Form>
    </Section>
  );
}

// ── 2. Schema validators (all 7 types) ─────────────────────────────

function SchemaValidators() {
  const [submitted, setSubmitted] = createSignal(false);

  const form = useForm({
    initialValues: { username: '', email: '', age: 0, website: '' },
    schema: {
      username: [v.required('Username is required'), v.minLength(3, 'Min 3 chars'), v.maxLength(20, 'Max 20 chars')],
      email: [v.required('Email is required'), v.email('Invalid email')],
      age: [v.min(18, 'Must be 18+'), v.max(99, 'Must be under 100')],
      website: [v.pattern(/^https:\/\//, 'Must start with https://')],
    },
    onSubmit: () => {
      setSubmitted(true);
    },
  });

  return (
    <Section id="schema-validators" title="Schema Validators">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Username"
            value={form.values.username}
            onInput={form.handleChange('username')}
            onBlur={form.handleBlur('username')}
            color={form.fieldColor('username')}
            helperText={form.fieldError('username')}
          />
          <TextInput
            label="Email"
            type="email"
            value={form.values.email}
            onInput={form.handleChange('email')}
            onBlur={form.handleBlur('email')}
            color={form.fieldColor('email')}
            helperText={form.fieldError('email')}
          />
          <TextInput
            label="Age"
            type="number"
            value={String(form.values.age)}
            onInput={form.handleChange('age')}
            onBlur={form.handleBlur('age')}
            color={form.fieldColor('age')}
            helperText={form.fieldError('age')}
          />
          <TextInput
            label="Website"
            value={form.values.website}
            onInput={form.handleChange('website')}
            onBlur={form.handleBlur('website')}
            color={form.fieldColor('website')}
            helperText={form.fieldError('website')}
          />
          <Button type="submit">Submit</Button>
          <Show when={submitted()}>
            <p data-testid="schema-success">Schema form submitted</p>
          </Show>
        </div>
      </Form>
    </Section>
  );
}

// ── 3. Validate on blur ─────────────────────────────────────────────

function ValidateOnBlur() {
  const form = useForm({
    initialValues: { name: '' },
    schema: {
      name: [v.required('Name is required'), v.minLength(2, 'Min 2 chars')],
    },
    onSubmit: () => {},
    validateOn: 'blur',
  });

  return (
    <Section id="validate-on-blur" title="Validate on Blur">
      <Form onSubmit={form.handleSubmit}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Name"
            value={form.values.name}
            onInput={form.handleChange('name')}
            onBlur={form.handleBlur('name')}
            color={form.fieldColor('name')}
            helperText={form.fieldError('name')}
          />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </Section>
  );
}

// ── 4. Validate on change ───────────────────────────────────────────

function ValidateOnChange() {
  const form = useForm({
    initialValues: { name: '' },
    schema: {
      name: [v.required('Name is required'), v.minLength(3, 'Min 3 chars')],
    },
    onSubmit: () => {},
    validateOn: 'change',
  });

  return (
    <Section id="validate-on-change" title="Validate on Change">
      <Form onSubmit={form.handleSubmit}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Name"
            value={form.values.name}
            onInput={form.handleChange('name')}
            onBlur={form.handleBlur('name')}
            color={form.fieldColor('name')}
            helperText={form.fieldError('name')}
          />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </Section>
  );
}

// ── 5. Cross-field validation (schema + validate) ───────────────────

function CrossField() {
  const [submitted, setSubmitted] = createSignal(false);

  const form = useForm({
    initialValues: { password: '', confirm: '' },
    schema: {
      password: [v.required('Password is required'), v.minLength(8, 'Min 8 chars')],
      confirm: [v.required('Confirmation is required')],
    },
    validate: (values) => {
      const errors: Partial<Record<string, string>> = {};
      if (values.password && values.confirm && values.password !== values.confirm) {
        errors.confirm = 'Passwords do not match';
      }
      return errors;
    },
    onSubmit: () => {
      setSubmitted(true);
    },
  });

  return (
    <Section id="cross-field" title="Cross-field Validation">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Password"
            type="password"
            value={form.values.password}
            onInput={form.handleChange('password')}
            onBlur={form.handleBlur('password')}
            color={form.fieldColor('password')}
            helperText={form.fieldError('password')}
          />
          <TextInput
            label="Confirm Password"
            type="password"
            value={form.values.confirm}
            onInput={form.handleChange('confirm')}
            onBlur={form.handleBlur('confirm')}
            color={form.fieldColor('confirm')}
            helperText={form.fieldError('confirm')}
          />
          <Button type="submit">Submit</Button>
          <Show when={submitted()}>
            <p data-testid="cross-field-success">Passwords match, submitted</p>
          </Show>
        </div>
      </Form>
    </Section>
  );
}

// ── 6. Password component-owned validation ───────────────────────────

function PasswordInternalValidation() {
  const [submittedValue, setSubmittedValue] = createSignal('');
  const form = useForm({
    initialValues: { password: '' },
    onSubmit: (values) => {
      setSubmittedValue(values.password);
    },
  });

  return (
    <Section
      id="password-internal-validation"
      title="Password Component Validation"
    >
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <Password
            label="Password"
            name="password"
            form={form}
            requiredStrength="strong"
            showStrength
            helperText="The password component owns this field validation."
          />
          <Button type="submit">Submit</Button>
          <Show when={submittedValue()}>
            <p data-testid="password-internal-success">Password form submitted</p>
            <p data-testid="password-internal-submitted">{submittedValue()}</p>
          </Show>
        </div>
      </Form>
    </Section>
  );
}

function PasswordCustomValidationMessage() {
  const form = useForm({
    initialValues: { password: '' },
    onSubmit: () => {},
  });

  return (
    <Section
      id="password-custom-message"
      title="Password Custom Validation Message"
    >
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <Password
            label="Password"
            name="password"
            form={form}
            requiredStrength="strong"
            validationMessage="Use a stronger password."
            showStrength
          />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </Section>
  );
}

// ── 7. Server errors (onSubmit returns field errors) ────────────────

function ServerErrors() {
  const form = useForm({
    initialValues: { email: '' },
    schema: {
      email: [v.required('Email is required'), v.email('Invalid email')],
    },
    onSubmit: () => {
      return { email: 'Email already taken' };
    },
  });

  return (
    <Section id="server-errors" title="Server Errors">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Email"
            value={form.values.email}
            onInput={form.handleChange('email')}
            onBlur={form.handleBlur('email')}
            color={form.fieldColor('email')}
            helperText={form.fieldError('email')}
          />
          <Button type="submit">Submit</Button>
        </div>
      </Form>
    </Section>
  );
}

// ── 8. Submit error (onSubmit throws) ───────────────────────────────

function SubmitError() {
  const form = useForm({
    initialValues: { name: '' },
    schema: {
      name: [v.required('Name is required')],
    },
    onSubmit: () => {
      throw new Error('Network error');
    },
  });

  return (
    <Section id="submit-error" title="Submit Error">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Name"
            value={form.values.name}
            onInput={form.handleChange('name')}
            onBlur={form.handleBlur('name')}
            color={form.fieldColor('name')}
            helperText={form.fieldError('name')}
          />
          <Button type="submit">Submit</Button>
          <Show when={form.submitError()}>
            <p data-testid="submit-error-msg" class="text-red-600">
              {form.submitError()!.message}
            </p>
          </Show>
        </div>
      </Form>
    </Section>
  );
}

// ── 9. Form state (isDirty, isSubmitting / aria-busy, reset) ────────

function FormState() {
  const form = useForm({
    initialValues: { name: '' },
    schema: {
      name: [v.required('Name is required')],
    },
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 500));
    },
  });

  return (
    <Section id="form-state" title="Form State">
      <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
        <div class="flex flex-col gap-3">
          <TextInput
            label="Name"
            value={form.values.name}
            onInput={form.handleChange('name')}
            onBlur={form.handleBlur('name')}
            color={form.fieldColor('name')}
            helperText={form.fieldError('name')}
          />
          <p data-testid="is-dirty">{form.isDirty() ? 'dirty' : 'pristine'}</p>
          <p data-testid="is-valid">{form.isValid() ? 'valid' : 'invalid'}</p>
          <div class="flex gap-2">
            <Button type="submit" disabled={form.isSubmitting()}>Submit</Button>
            <Button type="button" color="theme" onClick={() => form.reset()}>Reset</Button>
          </div>
        </div>
      </Form>
    </Section>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function FormPreview() {
  return (
    <div class="mx-auto max-w-2xl p-8">
      <h1 class="mb-8 text-2xl font-bold">Form E2E Test Fixture</h1>
      <BasicSubmit />
      <SchemaValidators />
      <ValidateOnBlur />
      <ValidateOnChange />
      <CrossField />
      <PasswordInternalValidation />
      <PasswordCustomValidationMessage />
      <ServerErrors />
      <SubmitError />
      <FormState />
    </div>
  );
}
