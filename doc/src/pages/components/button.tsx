import { createSignal } from 'solid-js';

import { Button } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function ButtonPage() {
  return (
    <DocPage
      title="Button"
      description="Button for triggering actions with multiple color variants, sizes, and a loading state with spinner overlay."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes for button variants',
        },
      ]}
      keyConcepts={[
        {
          term: 'Color Variants',
          explanation: 'Eight colors for visual hierarchy and semantic meaning.',
        },
        {
          term: 'Loading State',
          explanation: 'Spinner overlay prevents double-clicks during async operations.',
        },
        {
          term: 'Button Types',
          explanation: 'Controls form behavior: submit, reset, or button (default).',
        },
      ]}
      props={[
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Button content (required)',
        },
        {
          name: 'color',
          type: '"info" | "gray" | "dark" | "failure" | "light" | "success" | "warning" | "blue"',
          default: '"info"',
          description: 'Sets the color variant',
        },
        {
          name: 'size',
          type: '"xs" | "sm" | "md"',
          default: '"md"',
          description: 'Controls the button size',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description: 'Shows loading spinner and disables interactions',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the button',
        },
        {
          name: 'type',
          type: '"button" | "submit" | "reset"',
          default: '"button"',
          description: 'HTML button type attribute',
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
          title: 'Color Variants',
          description:
            'Eight color variants for different purposes and visual hierarchy.',
          code: `<Button color="info">Info</Button>
<Button color="gray">Gray</Button>
<Button color="dark">Dark</Button>
<Button color="light">Light</Button>
<Button color="success">Success</Button>
<Button color="failure">Failure</Button>
<Button color="warning">Warning</Button>
<Button color="blue">Blue</Button>`,
          component: () => (
            <>
              <Button color="info">Info</Button>
              <Button color="gray">Gray</Button>
              <Button color="dark">Dark</Button>
              <Button color="light">Light</Button>
              <Button color="success">Success</Button>
              <Button color="failure">Failure</Button>
              <Button color="warning">Warning</Button>
              <Button color="blue">Blue</Button>
            </>
          ),
        },
        {
          title: 'Size Variants',
          description: 'Three size options for different contexts.',
          code: `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>`,
          component: () => (
            <>
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
            </>
          ),
        },
        {
          title: 'Loading State',
          description:
            'Shows a spinner overlay during async operations. The button is automatically disabled.',
          code: `<Button isLoading={true}>Saving...</Button>
<Button isLoading={true} color="success">Processing</Button>`,
          component: () => (
            <>
              <Button isLoading={true}>Saving...</Button>
              <Button isLoading={true} color="success">
                Processing
              </Button>
            </>
          ),
        },
        {
          title: 'Disabled State',
          description:
            'Prevents user interaction when the button should not be clickable.',
          code: `<Button disabled>Disabled</Button>
<Button disabled color="success">Disabled Success</Button>`,
          component: () => (
            <>
              <Button disabled>Disabled</Button>
              <Button disabled color="success">
                Disabled Success
              </Button>
            </>
          ),
        },
        {
          title: 'Interactive Loading',
          description: 'Click the button to see loading state in action.',
          code: `const [isLoading, setIsLoading] = createSignal(false);

const handleClick = () => {
  setIsLoading(true);
  setTimeout(() => setIsLoading(false), 2000);
};

<Button isLoading={isLoading()} onClick={handleClick}>
  {isLoading() ? 'Loading...' : 'Click Me'}
</Button>`,
          component: () => {
            const [isLoading, setIsLoading] = createSignal(false);
            const handleClick = () => {
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 2000);
            };
            return (
              <Button isLoading={isLoading()} onClick={handleClick}>
                {isLoading() ? 'Loading...' : 'Click Me'}
              </Button>
            );
          },
        },
      ]}
      usage={`import { Button } from '@exowpee/solidly';

// Basic usage
<Button>Click me</Button>

// With color and size
<Button color="success" size="md">
  Save Changes
</Button>

// Loading state
<Button isLoading={isLoading()} onClick={handleSave}>
  {isLoading() ? 'Saving...' : 'Save'}
</Button>

// Form submit
<form onSubmit={handleSubmit}>
  <Button type="submit" color="success">
    Submit
  </Button>
</form>`}
    />
  );
}
