import { Badge } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function BadgePage() {
  return (
    <DocPage
      title="Badge"
      description="Compact status indicator with six color variants and two sizes."
      keyConcepts={[
        {
          term: 'Color Variants',
          explanation:
            'Six colors (default, gray, success, warning, failure, dark) for semantic meaning. Use success for positive states, failure for errors, warning for caution.',
        },
        {
          term: 'Compact Design',
          explanation:
            'Badges are intentionally small and unobtrusive. They supplement content rather than compete with it.',
        },
        {
          term: 'Size Options',
          explanation:
            'Two sizes (xs and sm) for different contexts. Use xs for inline badges and sm when more prominence is needed.',
        },
      ]}
      props={[
        {
          name: 'color',
          type: '"gray" | "failure" | "warning" | "success" | "dark" | "default"',
          default: '"default"',
          description: 'Color variant of the badge',
        },
        {
          name: 'size',
          type: '"xs" | "sm"',
          default: '"xs"',
          description: 'Size of the badge',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Badge content',
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
          description: 'Six color variants for different use cases.',
          code: `<Badge color="default">Default</Badge>
<Badge color="gray">Gray</Badge>
<Badge color="success">Success</Badge>
<Badge color="warning">Warning</Badge>
<Badge color="failure">Failure</Badge>
<Badge color="dark">Dark</Badge>`,
          component: () => (
            <div class="flex flex-wrap gap-2">
              <Badge color="default">Default</Badge>
              <Badge color="gray">Gray</Badge>
              <Badge color="success">Success</Badge>
              <Badge color="warning">Warning</Badge>
              <Badge color="failure">Failure</Badge>
              <Badge color="dark">Dark</Badge>
            </div>
          ),
        },
        {
          title: 'Sizes',
          description: 'Two size options: xs and sm.',
          code: `<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>`,
          component: () => (
            <div class="flex items-center gap-2">
              <Badge size="xs">Extra Small</Badge>
              <Badge size="sm">Small</Badge>
            </div>
          ),
        },
        {
          title: 'Status Indicators',
          description: 'Common use case for showing status.',
          code: `<Badge color="success">Active</Badge>
<Badge color="warning">Pending</Badge>
<Badge color="failure">Inactive</Badge>`,
          component: () => (
            <div class="flex gap-2">
              <Badge color="success">Active</Badge>
              <Badge color="warning">Pending</Badge>
              <Badge color="failure">Inactive</Badge>
            </div>
          ),
        },
      ]}
      usage={`import { Badge } from '@exowpee/solidly';

// Basic usage
<Badge>New</Badge>

// With color
<Badge color="success">Active</Badge>

// With size
<Badge size="sm" color="warning">Pending</Badge>`}
    />
  );
}
