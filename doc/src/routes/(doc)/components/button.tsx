import DocPage from '../../../components/DocPage';

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
          name: 'variant',
          type: '"solid" | "outline" | "transparent"',
          default: '"solid"',
          description: 'Sets the variant. "theme" color will fallback to "anti-theme" when value is "outline" or "transparent"',
        },
        {
          name: 'color',
          type: '"info" | "danger" | "theme" | "anti-theme"',
          default: '"info"',
          description: 'Sets the color. "theme" color will fallback to "anti-theme" when variant is "outline" or "transparent"',
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
          name: 'icon',
          type: '(props: IconProps) => JSX.Element',
          default: '-',
          description: 'Icon component to display alongside the button content',
        },
        {
          name: 'iconPlacement',
          type: '"left" | "right"',
          default: '"left"',
          description: 'Placement of the icon relative to the button content',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
      ]}
      usage={`
        import { Button } from '@kayou/ui';
        import { PlusIcon, ArrowRightIcon } from '@kayou/icons';

        // Basic usage
        <Button>Click me</Button>
        <Button size="md">Save</Button>
        <Button isLoading={true}>Saving...</Button>

        // With icon
        <Button icon={PlusIcon}>Create</Button>
        <Button icon={ArrowRightIcon} iconPlacement="right">Next</Button>
      `}
      playground={`
        import { Button } from '@kayou/ui';
        import { PlusIcon, ArrowRightIcon } from '@kayou/icons';
        import { createSignal } from 'solid-js';

        export default function Example() {
          const [isLoading, setIsLoading] = createSignal(false);

          const handleClick = () => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 2000);
          };

          return (
            <div class="flex flex-col gap-4">
              <div class="flex flex-wrap gap-2">
                <Button color="info">Info</Button>
                <Button color="danger">Danger</Button>
                <Button color="theme">Theme</Button>
                <Button color="anti-theme">Anti-theme</Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button color="info" variant="outline">Info</Button>
                <Button color="danger" variant="outline">Danger</Button>
                <Button color="anti-theme" variant="outline">Anti-theme</Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button color="info" variant="transparent">Info</Button>
                <Button color="danger" variant="transparent">Danger</Button>
                <Button color="anti-theme" variant="transparent">Anti-theme</Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button icon={PlusIcon}>Create</Button>
                <Button icon={ArrowRightIcon} iconPlacement="right">Next</Button>
              </div>
              <div class="flex flex-wrap gap-2">
                <Button isLoading={isLoading()} onClick={handleClick}>
                  {isLoading() ? 'Loading...' : 'Click Me'}
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          );
        }
      `}
    />
  );
}
