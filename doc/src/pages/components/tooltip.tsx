import Button from '@lib/components/Button';
import Tooltip from '@lib/components/Tooltip';
import DocPage from '../../components/DocPage';

export default function TooltipPage() {
  return (
    <DocPage
      title="Tooltip"
      description="Tooltip component for displaying contextual information on hover or focus. Built on top of the useFloating hook, it automatically calculates the optimal position to ensure visibility within the viewport, flipping to the opposite side when necessary. The component handles both mouse and keyboard interactions, making it fully accessible with screen reader support via aria-describedby. It uses a portal to render outside the normal DOM hierarchy, preventing z-index and overflow issues common with nested tooltips. Supports configurable show/hide delays and automatic theme detection."
      keyConcepts={[
        {
          term: 'Trigger Element',
          explanation:
            'The child element that activates the tooltip on hover or focus. This is passed as children to the Tooltip component.',
        },
        {
          term: 'Placement',
          explanation:
            'The preferred position (top, bottom, left, right) where the tooltip appears. The component automatically flips to the opposite side if there is insufficient space.',
        },
        {
          term: 'Show/Hide Delay',
          explanation:
            'Configurable delays prevent tooltips from appearing instantly on accidental hovers and from disappearing too quickly when moving between elements.',
        },
        {
          term: 'Accessibility',
          explanation:
            'The tooltip is linked to its trigger via aria-describedby, ensuring screen readers announce the tooltip content when the trigger is focused.',
        },
      ]}
      value="Tooltips provide contextual guidance without leaving the workflow. This component ensures consistent tooltip behavior across the application, with built-in accessibility compliance for WCAG requirements. The automatic positioning prevents common issues like tooltips being cut off in modals or sidebars, while the delay configuration helps reduce visual noise in dense interfaces."
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
          type: '"dark" | "light" | "auto"',
          default: '"auto"',
          description:
            'Theme variant of the tooltip. "auto" inverts based on current app theme',
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
      ]}
      examples={[
        {
          title: 'Basic Tooltip',
          description: 'Simple tooltip on hover or focus.',
          code: `<Tooltip content="This is a tooltip">
  <Button>Hover me</Button>
</Tooltip>`,
          component: () => (
            <Tooltip content="This is a tooltip">
              <Button>Hover me</Button>
            </Tooltip>
          ),
        },
        {
          title: 'Placement Options',
          description: 'Tooltips can be positioned on any side.',
          code: `<Tooltip content="Top tooltip" placement="top">...</Tooltip>
<Tooltip content="Bottom tooltip" placement="bottom">...</Tooltip>
<Tooltip content="Left tooltip" placement="left">...</Tooltip>
<Tooltip content="Right tooltip" placement="right">...</Tooltip>`,
          component: () => (
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
          ),
        },
        {
          title: 'Theme Variants',
          description: 'Dark, light, or auto theme based on app theme.',
          code: `<Tooltip content="Dark tooltip" theme="dark">...</Tooltip>
<Tooltip content="Light tooltip" theme="light">...</Tooltip>
<Tooltip content="Auto tooltip" theme="auto">...</Tooltip>`,
          component: () => (
            <div class="flex flex-wrap items-center gap-4">
              <Tooltip content="Dark tooltip" theme="dark">
                <Button color="light">Dark</Button>
              </Tooltip>
              <Tooltip content="Light tooltip" theme="light">
                <Button color="light">Light</Button>
              </Tooltip>
              <Tooltip content="Auto (inverts)" theme="auto">
                <Button color="light">Auto</Button>
              </Tooltip>
            </div>
          ),
        },
        {
          title: 'With Delay',
          description: 'Add delays before showing or hiding the tooltip.',
          code: `<Tooltip content="Delayed tooltip" showDelay={500} hideDelay={200}>
  <Button>Hover (500ms delay)</Button>
</Tooltip>`,
          component: () => (
            <Tooltip content="Delayed tooltip" showDelay={500} hideDelay={200}>
              <Button>Hover (500ms delay)</Button>
            </Tooltip>
          ),
        },
        {
          title: 'Rich Content',
          description: 'Tooltip content can be JSX elements.',
          code: `<Tooltip
  content={
    <div class="text-center">
      <p class="font-semibold">Rich Tooltip</p>
      <p class="text-xs opacity-75">With multiple lines</p>
    </div>
  }
>
  <Button>Rich content</Button>
</Tooltip>`,
          component: () => (
            <Tooltip
              content={
                <div class="text-center">
                  <p class="font-semibold">Rich Tooltip</p>
                  <p class="text-xs opacity-75">With multiple lines</p>
                </div>
              }
            >
              <Button>Rich content</Button>
            </Tooltip>
          ),
        },
        {
          title: 'On Text Elements',
          description: 'Tooltips work with any focusable or hoverable element.',
          code: `<Tooltip content="Click to learn more">
  <a href="#" class="text-blue-600 underline">
    What is this?
  </a>
</Tooltip>`,
          component: () => (
            <Tooltip content="Click to learn more">
              <a
                href="#"
                class="text-blue-600 underline dark:text-blue-400"
                onClick={(e) => e.preventDefault()}
              >
                What is this?
              </a>
            </Tooltip>
          ),
        },
      ]}
      usage={`import { Tooltip } from '@exowpee/the_rock';

// Basic usage
<Tooltip content="Helpful information">
  <Button>Hover me</Button>
</Tooltip>

// With placement
<Tooltip content="Bottom tooltip" placement="bottom">
  <span>Hover for info</span>
</Tooltip>

// With theme
<Tooltip content="Light themed" theme="light">
  <Button>Light tooltip</Button>
</Tooltip>

// With delays (good for preventing accidental triggers)
<Tooltip content="Delayed" showDelay={300} hideDelay={100}>
  <Button>Hover me</Button>
</Tooltip>

// Rich content
<Tooltip
  content={
    <div>
      <strong>Title</strong>
      <p>Description text</p>
    </div>
  }
>
  <Button>Info</Button>
</Tooltip>

// Programmatically hidden
<Tooltip content="Won't show" hidden={isDisabled()}>
  <Button>Disabled tooltip</Button>
</Tooltip>`}
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
