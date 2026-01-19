import { Breadcrumb } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

export default function BreadcrumbPage() {
  return (
    <DocPage
      title="Breadcrumb"
      description="Navigation trail showing page hierarchy with support for custom link components."
      keyConcepts={[
        {
          term: 'Hierarchical Navigation',
          explanation:
            'Each breadcrumb item represents a level in the site hierarchy, from the root (usually Home) to the current page.',
        },
        {
          term: 'Current Page Indicator',
          explanation:
            'The last item typically represents the current page and is styled differently (no link, aria-current="page") to indicate the user\'s location.',
        },
        {
          term: 'Router Integration',
          explanation:
            'The "as" prop allows using custom link components (e.g., A from @solidjs/router) instead of native anchor tags for SPA navigation.',
        },
      ]}
      props={[
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Breadcrumb.Item elements',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the nav element',
        },
      ]}
      examples={[
        {
          title: 'Basic Breadcrumb',
          description: 'Simple breadcrumb navigation with links.',
          code: `<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
  <Breadcrumb.Item>Current Page</Breadcrumb.Item>
</Breadcrumb>`,
          component: () => (
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
              <Breadcrumb.Item>Current Page</Breadcrumb.Item>
            </Breadcrumb>
          ),
        },
        {
          title: 'With Current Page',
          description: 'Using isCurrent prop to mark the current page.',
          code: `<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/settings">Settings</Breadcrumb.Item>
  <Breadcrumb.Item isCurrent>Profile</Breadcrumb.Item>
</Breadcrumb>`,
          component: () => (
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/settings">Settings</Breadcrumb.Item>
              <Breadcrumb.Item isCurrent>Profile</Breadcrumb.Item>
            </Breadcrumb>
          ),
        },
        {
          title: 'All Links',
          description: 'Breadcrumb where all items are clickable.',
          code: `<Breadcrumb>
  <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
  <Breadcrumb.Item href="/users">Users</Breadcrumb.Item>
  <Breadcrumb.Item href="/users/123">John Doe</Breadcrumb.Item>
</Breadcrumb>`,
          component: () => (
            <Breadcrumb>
              <Breadcrumb.Item href="/">Dashboard</Breadcrumb.Item>
              <Breadcrumb.Item href="/users">Users</Breadcrumb.Item>
              <Breadcrumb.Item href="/users/123">John Doe</Breadcrumb.Item>
            </Breadcrumb>
          ),
        },
      ]}
      usage={`import { Breadcrumb } from '@exowpee/solidly';

// Basic usage
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/products">Products</Breadcrumb.Item>
  <Breadcrumb.Item>Details</Breadcrumb.Item>
</Breadcrumb>

// With custom link component (e.g., SolidJS Router)
import { Link } from '@solidjs/router';

<Breadcrumb>
  <Breadcrumb.Item href="/" as={Link}>Home</Breadcrumb.Item>
  <Breadcrumb.Item href="/about" as={Link}>About</Breadcrumb.Item>
</Breadcrumb>

// Marking current page
<Breadcrumb>
  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
  <Breadcrumb.Item isCurrent>Current</Breadcrumb.Item>
</Breadcrumb>`}
    />
  );
}
