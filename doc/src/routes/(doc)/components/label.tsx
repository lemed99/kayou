import DocPage from '../../../components/DocPage';

export default function LabelPage() {
  return (
    <DocPage
      title="Label"
      description="Form label with five color variants and support for custom content."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Semantic HTML',
          explanation: 'Native <label> with "for" links to inputs for accessibility.',
        },
        {
          term: 'Color States',
          explanation: 'Gray for normal, failure/success/warning for validation states.',
        },
        {
          term: 'Flexible Content',
          explanation: 'value for text; children for custom JSX like required asterisks.',
        },
      ]}
      props={[
        {
          name: 'value',
          type: 'string',
          default: '-',
          description: 'Text value to display in the label',
        },
        {
          name: 'color',
          type: '"gray" | "info" | "failure" | "warning" | "success"',
          default: '"gray"',
          description: 'Color variant of the label',
        },
        {
          name: 'for',
          type: 'string',
          default: '-',
          description: 'ID of the form element this label is for',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Alternative to value prop for label content',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
      ]}
      playground={`
        import { Label } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-1">
              <Label value="Username" for="username-input" />
              <input
                id="username-input"
                type="text"
                placeholder="Enter username"
                class="w-64 rounded-lg border border-neutral-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          );
        }
      `}
      usage={`
        import { Label } from '@kayou/ui';

        <Label value="Email" />
        <Label value="Username" for="username-input" />
        <Label value="Error field" color="failure" />
      `}
    />
  );
}
