import { Label } from '@kayou/ui';
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
      examples={[
        {
          title: 'Basic Label',
          description: 'Simple label with value prop.',
          component: () => (
            <div class="flex flex-col gap-2">
              <Label value="Email" />
              <Label value="Password" />
            </div>
          ),
        },
        {
          title: 'Color Variants',
          description: 'Five color variants for different states.',
          component: () => (
            <div class="flex flex-col gap-2">
              <Label value="Default label" color="gray" />
              <Label value="Info label" color="info" />
              <Label value="Success label" color="success" />
              <Label value="Warning label" color="warning" />
              <Label value="Error label" color="failure" />
            </div>
          ),
        },
        {
          title: 'With Form Element',
          description: 'Label associated with an input using the for attribute.',
          component: () => (
            <div class="flex flex-col gap-1">
              <Label value="Username" for="username-input" />
              <input
                id="username-input"
                type="text"
                placeholder="Enter username"
                class="w-64 rounded-lg border border-gray-300 p-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800"
              />
            </div>
          ),
        },
        {
          title: 'Using Children',
          description: 'Using children instead of value prop.',
          component: () => (
            <Label for="email">
              Email Address <span class="text-red-500">*</span>
            </Label>
          ),
        },
      ]}
      usage={`
        import { Label } from '@kayou/ui';

        <Label value="Email" />
        <Label value="Username" for="username-input" />
        <Label value="Error field" color="failure" />
      `}
    />
  );
}
