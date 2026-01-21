import { Alert } from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

const InfoIcon = (props: { class: string }) => (
  <svg class={props.class} fill="currentColor" viewBox="0 0 20 20">
    <path
      fill-rule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
      clip-rule="evenodd"
    />
  </svg>
);

export default function AlertPage() {
  return (
    <DocPage
      title="Alert"
      description="Message banner with five color variants, optional icons, and additional content sections."
      dependencies={[
        {
          name: 'tailwind-merge',
          url: 'https://github.com/dcastil/tailwind-merge',
          usage: 'Merges Tailwind CSS classes without conflicts',
        },
      ]}
      keyConcepts={[
        {
          term: 'Color Variants',
          explanation: 'Five semantic colors convey message type at a glance.',
        },
        {
          term: 'Icon Support',
          explanation: 'Optional icon component reinforces message type visually.',
        },
        {
          term: 'Additional Content',
          explanation: 'Slot for details, lists, or action buttons below main message.',
        },
      ]}
      props={[
        {
          name: 'color',
          type: '"info" | "failure" | "success" | "warning" | "dark"',
          default: '"info"',
          description: 'Color variant of the alert',
        },
        {
          name: 'icon',
          type: '(props: { class: string }) => JSX.Element',
          default: '-',
          description: 'Optional icon component to display',
        },
        {
          name: 'additionalContent',
          type: 'JSX.Element',
          default: '-',
          description: 'Additional content below the main message',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description: 'Main alert message content',
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
          description: 'Five color variants for different message types.',
          code: `<Alert color="info">Info alert message</Alert>
<Alert color="success">Success alert message</Alert>
<Alert color="warning">Warning alert message</Alert>
<Alert color="failure">Failure alert message</Alert>
<Alert color="dark">Dark alert message</Alert>`,
          component: () => (
            <div class="flex flex-col gap-4">
              <Alert color="info">Info alert message</Alert>
              <Alert color="success">Success alert message</Alert>
              <Alert color="warning">Warning alert message</Alert>
              <Alert color="failure">Failure alert message</Alert>
              <Alert color="dark">Dark alert message</Alert>
            </div>
          ),
        },
        {
          title: 'With Icon',
          description: 'Display an icon alongside the alert message.',
          code: `<Alert color="info" icon={InfoIcon}>
  Alert with an info icon
</Alert>`,
          component: () => (
            <Alert color="info" icon={InfoIcon}>
              Alert with an info icon
            </Alert>
          ),
        },
        {
          title: 'With Additional Content',
          description: 'Add extra content below the main message.',
          code: `<Alert
  color="warning"
  additionalContent={
    <div class="mt-2 text-sm">
      Please review the details and take action.
    </div>
  }
>
  Warning: Action required
</Alert>`,
          component: () => (
            <Alert
              color="warning"
              additionalContent={
                <div class="mt-2 text-sm">Please review the details and take action.</div>
              }
            >
              Warning: Action required
            </Alert>
          ),
        },
      ]}
      usage={`import { Alert } from '@exowpee/solidly';

// Basic usage
<Alert color="info">This is an info message</Alert>

// With icon
<Alert color="success" icon={CheckIcon}>
  Operation completed successfully
</Alert>

// With additional content
<Alert
  color="failure"
  additionalContent={<button>Retry</button>}
>
  An error occurred
</Alert>`}
    />
  );
}
