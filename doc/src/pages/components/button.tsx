import Button from '../../components/Button';
import DocPage from '../../doc/components/DocPage';

export default function ButtonPage() {
  return (
    <DocPage
      title="Button Component"
      description="The Button component is a versatile and customizable button that supports various colors, sizes, and states. It's built with accessibility in mind and follows modern design principles."
      props={[
        {
          name: 'color',
          type: '"gray" | "dark" | "failure" | "info" | "light" | "success" | "warning" | "blue"',
          default: '"info"',
          description: "Sets the button's color variant",
        },
        {
          name: 'size',
          type: '"xs" | "sm" | "md" | "lg" | "xl"',
          default: '"md"',
          description: "Sets the button's size",
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the button',
        },
      ]}
      examples={[
        {
          title: 'Color Variants',
          code: `<Button color="gray">Gray</Button>
<Button color="dark">Dark</Button>
<Button color="failure">Failure</Button>
<Button color="info">Info</Button>
<Button color="light">Light</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="blue">Blue</Button>`,
          component: () => (
            <>
              <Button color="gray">Gray</Button>
              <Button color="dark">Dark</Button>
              <Button color="failure">Failure</Button>
              <Button color="info">Info</Button>
              <Button color="light">Light</Button>
              <Button color="success">Success</Button>
              <Button color="warning">Warning</Button>
              <Button color="blue">Blue</Button>
            </>
          ),
        },
        {
          title: 'Size Variants',
          code: `<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>`,
          component: () => (
            <>
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </>
          ),
        },
        {
          title: 'Disabled State',
          code: `<Button disabled>Disabled Button</Button>`,
          component: () => <Button disabled>Disabled Button</Button>,
        },
      ]}
      usage={`import Button from "path/to/components/Button";

// Basic usage
<Button>Click me</Button>

// With props
<Button color="success" size="lg" disabled={false}>
  Submit
</Button>`}
    />
  );
}
