import Skeleton from '@lib/components/Skeleton';
import DocPage from '../../components/DocPage';

export default function SkeletonPage() {
  return (
    <DocPage
      title="Skeleton"
      description="A loading placeholder component that displays animated shapes while content is being fetched. Skeletons provide a better loading experience than spinners for content-heavy interfaces by showing the approximate layout of incoming content, reducing perceived loading time and preventing layout shifts. This component features a subtle pulse animation, fully customizable dimensions (supporting both fixed pixels and responsive percentages), and configurable gray shades for light and dark modes. Built with accessibility in mind, it uses aria-busy and role='status' so screen readers announce loading state."
      keyConcepts={[
        {
          term: 'Content Layout Hints',
          explanation:
            'Skeletons should approximate the shape and size of the content they replace. This reduces layout shift when content loads and gives users a preview of the incoming structure.',
        },
        {
          term: 'Flexible Sizing',
          explanation:
            'Width and height accept numbers (pixels) or strings (percentages, rem, etc.). Use "100%" for responsive skeletons that fill their container.',
        },
        {
          term: 'Theme Adaptation',
          explanation:
            'The gray and darkGray props control appearance in light and dark modes respectively. Default values work well in most cases, but can be adjusted for specific design requirements.',
        },
      ]}
      value="Skeleton loading dramatically improves perceived performance. Research shows users perceive skeleton screens as faster than spinners for equivalent wait times. By showing the content structure beforehand, skeletons reduce anxiety about what will appear and create a smoother visual transition when data arrives."
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
      ]}
      examples={[
        {
          title: 'Basic Skeleton',
          description: 'Default skeleton with default dimensions.',
          code: `<Skeleton />`,
          component: () => <Skeleton />,
        },
        {
          title: 'Custom Dimensions',
          description: 'Skeleton with custom width and height.',
          code: `<Skeleton width={200} height={20} />
<Skeleton width="100%" height={16} />
<Skeleton width={100} height={100} />`,
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
          code: `<Skeleton width={150} height={16} gray={100} />
<Skeleton width={150} height={16} gray={200} />
<Skeleton width={150} height={16} gray={300} />`,
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
          code: `<div class="flex gap-4">
  <Skeleton width={64} height={64} />
  <div class="flex flex-col gap-2">
    <Skeleton width={200} height={20} />
    <Skeleton width={150} height={14} />
    <Skeleton width={180} height={14} />
  </div>
</div>`,
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
          code: `<div class="flex flex-col gap-3">
  <Skeleton width="100%" height={40} />
  <Skeleton width="100%" height={40} />
  <Skeleton width="100%" height={40} />
</div>`,
          component: () => (
            <div class="flex w-64 flex-col gap-3">
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
              <Skeleton width="100%" height={40} />
            </div>
          ),
        },
      ]}
      usage={`import { Skeleton } from '@exowpee/the_rock';

// Basic usage
<Skeleton />

// Custom dimensions (number = pixels)
<Skeleton width={200} height={20} />

// Percentage width
<Skeleton width="100%" height={16} />

// Custom gray shades
<Skeleton width={150} height={16} gray={200} darkGray={600} />

// Loading card layout
<Show when={loading()} fallback={<CardContent />}>
  <div class="flex gap-4">
    <Skeleton width={64} height={64} />
    <div class="flex flex-col gap-2">
      <Skeleton width={200} height={20} />
      <Skeleton width={150} height={14} />
    </div>
  </div>
</Show>`}
    />
  );
}
