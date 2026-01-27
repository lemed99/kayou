import { Skeleton } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

export default function SkeletonPage() {
  return (
    <DocPage
      title="Skeleton"
      description="Animated loading placeholder with customizable dimensions for content-heavy interfaces."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Content Layout Hints',
          explanation: 'Match shape and size of content to reduce layout shift.',
        },
        {
          term: 'Flexible Sizing',
          explanation: 'Accepts numbers (px) or strings (%, rem); "100%" for responsive.',
        },
        {
          term: 'Theme Adaptation',
          explanation: 'gray/darkGray props control light/dark mode appearance.',
        },
      ]}
      props={[
        {
          name: 'width',
          type: 'string | number',
          default: '50',
          description: 'Width of the skeleton. Number for px, string for custom units.',
        },
        {
          name: 'height',
          type: 'string | number',
          default: '10',
          description: 'Height of the skeleton. Number for px, string for custom units.',
        },
        {
          name: 'gray',
          type: 'number',
          default: '100',
          description: 'Gray shade for light mode (100-900)',
        },
        {
          name: 'darkGray',
          type: 'number',
          default: '700',
          description: 'Gray shade for dark mode (100-900)',
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes',
        },
        {
          name: 'ariaLabels',
          type: 'Partial<SkeletonAriaLabels>',
          default: 'DEFAULT_SKELETON_ARIA_LABELS',
          description: 'Accessibility labels for screen readers',
        },
      ]}
      subComponents={[
        {
          name: 'SkeletonAriaLabels',
          kind: 'type',
          description: 'Aria labels for the Skeleton component',
          props: [
            {
              name: 'loading',
              type: 'string',
              default: '"Loading..."',
              description: 'Label for the loading skeleton',
            },
          ],
        },
      ]}
      examples={[
        {
          title: 'Basic Skeleton',
          description: 'Default skeleton with default dimensions.',
          component: () => <Skeleton />,
        },
        {
          title: 'Custom Dimensions',
          description: 'Skeleton with custom width and height.',
          component: () => (
            <div class="flex flex-col gap-4">
              <Skeleton width={200} height={20} />
              <Skeleton width="100%" height={16} />
              <Skeleton width={100} height={100} />
            </div>
          ),
        },
        {
          title: 'Gray Shades',
          description: 'Different gray intensities for light mode.',
          component: () => (
            <div class="flex flex-col gap-4">
              <Skeleton width={150} height={16} gray={100} />
              <Skeleton width={150} height={16} gray={200} />
              <Skeleton width={150} height={16} gray={300} />
            </div>
          ),
        },
        {
          title: 'Card Loading State',
          description: 'Simulating a loading card layout.',
          component: () => (
            <div class="flex gap-4">
              <Skeleton width={64} height={64} />
              <div class="flex flex-col gap-2">
                <Skeleton width={200} height={20} />
                <Skeleton width={150} height={14} />
                <Skeleton width={180} height={14} />
              </div>
            </div>
          ),
        },
        {
          title: 'List Loading State',
          description: 'Multiple skeletons for list items.',
          component: () => (
            <div class="flex w-64 flex-col gap-3">
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
            </div>
          ),
        },
      ]}
      usage={`
        import { Skeleton } from '@kayou/ui';

        <Skeleton />
        <Skeleton width={200} height={20} />
        <Skeleton width="100%" height={16} gray={200} darkGray={600} />
      `}
    />
  );
}
