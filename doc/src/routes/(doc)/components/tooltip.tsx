import DocPage from '../../../components/DocPage';

export default function TooltipPage() {
  return (
    <DocPage
      title="Tooltip"
      description="Auto-positioned hint text on hover/focus with configurable delays and placement."
      dependencies={[
        {
          name: '@solid-primitives/presence',
          url: 'https://primitives.solidjs.community/package/presence',
          usage: 'Provides createPresence for tooltip visibility transitions',
        },
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Trigger Element',
          explanation: 'Child element activates tooltip on hover or focus.',
        },
        {
          term: 'Placement',
          explanation:
            'Position (top/bottom/left/right) with auto-flip if space is insufficient.',
        },
        {
          term: 'Show/Hide Delay',
          explanation:
            'Configurable delays prevent accidental triggers and quick disappear.',
        },
        {
          term: 'Accessibility',
          explanation: 'Linked via aria-describedby for screen reader announcement.',
        },
      ]}
      props={[
        {
          name: 'content',
          type: 'string | JSX.Element',
          default: '-',
          description: 'Content to display inside the tooltip (required)',
        },
        {
          name: 'placement',
          type: '"top" | "bottom" | "left" | "right"',
          default: '"top"',
          description: 'Position of the tooltip relative to the trigger element',
        },
        {
          name: 'theme',
          type: '"dark" | "light" | "auto" | "invert"',
          default: '"auto"',
          description:
            'Theme variant. "auto" follows the current theme, "invert" uses the opposite theme',
        },
        {
          name: 'hidden',
          type: 'boolean',
          default: 'false',
          description: 'Whether to programmatically hide the tooltip',
        },
        {
          name: 'showDelay',
          type: 'number',
          default: '0',
          description: 'Delay in milliseconds before showing the tooltip',
        },
        {
          name: 'hideDelay',
          type: 'number',
          default: '0',
          description: 'Delay in milliseconds before hiding the tooltip',
        },
        {
          name: 'wrapperClass',
          type: 'string',
          default: '-',
          description: 'Additional CSS classes for the trigger wrapper element',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'The trigger element that shows the tooltip on hover/focus',
        },
        {
          name: 'backgroundScrollBehavior',
          type: '"prevent" | "close" | "follow"',
          default: '"close"',
          description:
            'How to handle background scroll when tooltip is visible. "close" closes on scroll, "follow" updates position and hides when anchor exits, "prevent" locks scroll.',
        },
      ]}
      playground={`
        import { Button, Tooltip } from '@kayou/ui';

        export default function Example() {
          return (
            <div class="flex flex-col gap-6">
              {/* All 4 placements */}
              <div class="flex flex-wrap items-center gap-4">
                <Tooltip content="Top tooltip" placement="top">
                  <Button color="light">Top</Button>
                </Tooltip>
                <Tooltip content="Bottom tooltip" placement="bottom">
                  <Button color="light">Bottom</Button>
                </Tooltip>
                <Tooltip content="Left tooltip" placement="left">
                  <Button color="light">Left</Button>
                </Tooltip>
                <Tooltip content="Right tooltip" placement="right">
                  <Button color="light">Right</Button>
                </Tooltip>
              </div>

              {/* Rich content */}
              <Tooltip content={<div class="text-center"><p class="font-semibold">Rich Tooltip</p><p class="text-xs opacity-75">With multiple lines of content</p></div>}>
                <Button>Rich content</Button>
              </Tooltip>
            </div>
          );
        }
      `}
      usage={`
        import { Tooltip } from '@kayou/ui';

        <Tooltip content="Helpful info"><Button>Hover me</Button></Tooltip>
        <Tooltip content="Info" placement="bottom"><span>Target</span></Tooltip>
        <Tooltip content="Info" theme="invert" showDelay={300}><Button>Target</Button></Tooltip>
      `}
      relatedHooks={[
        {
          name: 'useFloating',
          path: '/hooks/use-floating',
          description:
            'Positioning engine that handles floating element placement, viewport boundary detection, and automatic flipping.',
        },
      ]}
    />
  );
}
