import Breadcrumb from '@lib/components/Breadcrumb';
import DocPage from '../../components/DocPage';

export default function BreadcrumbPage() {
  return (
    <DocPage
      title="Breadcrumb"
      description="Breadcrumb navigation component for showing page hierarchy and location within an application. Breadcrumbs help users understand where they are in a site structure and provide quick navigation to parent pages. The component uses semantic nav and ol elements with aria-label for accessibility, ensuring screen readers properly announce the navigation context. Supports custom link components via the 'as' prop for seamless integration with client-side routers like SolidJS Router."
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
      value="Breadcrumbs reduce user disorientation in deep navigation structures. They provide a clear path back to higher-level pages and help users build a mental model of the site architecture, reducing reliance on the browser back button."
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
      usage={`import { Breadcrumb } from '@exowpee/the_rock';

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
