import { Breadcrumb, type BreadcrumbItemData } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function BreadcrumbPage() {
  return (
    <DocPage
      title="Breadcrumb"
      description="Navigation trail showing page hierarchy with support for custom link components."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Data-Driven',
          explanation:
            'Items are defined as an array of BreadcrumbItemData objects, similar to Accordion panels.',
        },
        {
          term: 'Hierarchical Navigation',
          explanation:
            'Items represent hierarchy levels from root to current page.',
        },
        {
          term: 'Current Page Indicator',
          explanation:
            'Items with isCurrent render as a span with aria-current="page", never as a link.',
        },
        {
          term: 'Router Integration',
          explanation:
            'The "as" prop on Breadcrumb enables a custom link component for SPA navigation, applied to all link items.',
        },
      ]}
      props={[
        {
          name: 'items',
          type: 'BreadcrumbItemData[]',
          default: '[]',
          description:
            'Array of breadcrumb item data objects containing label, optional href, isCurrent, and class',
        },
        {
          name: 'as',
          type: 'ValidComponent',
          default: "'a'",
          description:
            'Custom link component for SPA navigation (e.g., Router Link). Applied to all link items.',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the nav element',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<BreadcrumbAriaLabels>',
          default: 'DEFAULT_BREADCRUMB_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'BreadcrumbItemData',
          kind: 'type',
          description: 'Data structure for each breadcrumb item',
          props: [
            {
              name: 'label',
              type: 'JSX.Element',
              default: '-',
              description:
                'Text or JSX content displayed for the breadcrumb item',
            },
            {
              name: 'href',
              type: 'string',
              default: '-',
              description:
                'URL for the breadcrumb link. If omitted or if isCurrent is true, renders as a span.',
            },
            {
              name: 'isCurrent',
              type: 'boolean',
              default: 'false',
              description:
                'Whether this item represents the current page. Renders as span with aria-current="page".',
            },
            {
              name: 'class',
              type: 'string',
              default: '-',
              description: 'Additional CSS classes for the <li> element.',
            },
          ],
        },
        {
          name: 'BreadcrumbAriaLabels',
          kind: 'type',
          description: 'Aria labels for the Breadcrumb component',
          props: [
            {
              name: 'breadcrumb',
              type: 'string',
              default: '"Breadcrumb"',
              description: 'Label for the breadcrumb nav element',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Breadcrumb',
          description: 'Simple breadcrumb navigation with links.',
          component: () => {
            const items: BreadcrumbItemData[] = [
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: 'Current Page' },
            ];
            return <Breadcrumb items={items} />;
          },
        },
        {
          title: 'With Current Page',
          description:
            'Using isCurrent to mark the active page. Renders as span with aria-current.',
          component: () => {
            const items: BreadcrumbItemData[] = [
              { label: 'Home', href: '/' },
              { label: 'Settings', href: '/settings' },
              { label: 'Profile', isCurrent: true },
            ];
            return <Breadcrumb items={items} />;
          },
        },
        {
          title: 'All Links',
          description: 'Breadcrumb where all items are clickable links.',
          component: () => {
            const items: BreadcrumbItemData[] = [
              { label: 'Dashboard', href: '/' },
              { label: 'Users', href: '/users' },
              { label: 'John Doe', href: '/users/123' },
            ];
            return <Breadcrumb items={items} />;
          },
        },
        {
          title: 'Custom Aria Label (i18n)',
          description: 'Using ariaLabels for internationalization.',
          component: () => {
            const items: BreadcrumbItemData[] = [
              { label: 'Accueil', href: '/' },
              { label: 'Produits', href: '/products' },
              { label: 'Page actuelle', isCurrent: true },
            ];
            return (
              <Breadcrumb
                items={items}
                ariaLabels={{ breadcrumb: "Fil d'Ariane" }}
              />
            );
          },
        },
      ]}
      usage={`
        import { Breadcrumb, type BreadcrumbItemData } from '@kayou/ui';

        const items: BreadcrumbItemData[] = [
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Details', isCurrent: true },
        ];

        <Breadcrumb items={items} />
        <Breadcrumb items={items} as={Link} /> // with router Link
        <Breadcrumb items={items} ariaLabels={{ breadcrumb: "Fil d'Ariane" }} />
      `}
    />
  );
}
