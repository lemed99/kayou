import { InfoCircleIcon } from '@kayou/icons';

import { Alert } from '@kayou/ui';
import DocPage from '../../../components/DocPage';

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
          component: () => (
            <Alert color="info" icon={InfoCircleIcon}>
              Alert with an info icon
            </Alert>
          ),
        },
        {
          title: 'With Additional Content',
          description: 'Add extra content below the main message.',
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
      usage={`
        import { Alert } from '@kayou/ui';

        <Alert color="info">Info message</Alert>
        <Alert color="success" icon={CheckIcon}>Success message</Alert>
        <Alert color="failure" additionalContent={<button>Retry</button>}>Error</Alert>
      `}
    />
  );
}
