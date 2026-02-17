import { type JSX, splitProps } from 'solid-js';

/**
 * Props for the Form component.
 */
export interface FormProps
  extends Omit<JSX.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** Submit handler. Typically pass `form.handleSubmit` from useForm. */
  onSubmit: (e: SubmitEvent) => void | Promise<void>;

  /** Whether the form is currently submitting. Controls `aria-busy`. */
  isSubmitting?: boolean;
}

/**
 * Thin form wrapper that handles `preventDefault`, disables native browser
 * validation, and sets `aria-busy` during submission.
 *
 * @example
 * ```tsx
 * const form = useForm({ ... });
 *
 * <Form onSubmit={form.handleSubmit} isSubmitting={form.isSubmitting()}>
 *   <TextInput ... />
 *   <Button type="submit">Submit</Button>
 * </Form>
 * ```
 */
const Form = (props: FormProps): JSX.Element => {
  const [local, formProps] = splitProps(props, [
    'onSubmit',
    'isSubmitting',
    'children',
  ]);

  const handleSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (e) => {
    e.preventDefault();
    Promise.resolve(local.onSubmit(e)).catch(console.error);
  };

  return (
    <form
      {...formProps}
      noValidate
      aria-busy={local.isSubmitting || undefined}
      onSubmit={handleSubmit}
    >
      {local.children}
    </form>
  );
};

export default Form;
