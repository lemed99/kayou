import DocPage from '../../../components/DocPage';

export default function VirtualGridPage() {
  return (
    <DocPage
      title="VirtualGrid"
      description="Virtualized grid rendering only visible items with CSS-driven column detection and keyboard navigation."
      keyConcepts={[
        {
          term: 'CSS-Driven Columns',
          explanation:
            'Column count from CSS class (e.g., "grid-cols-3"); supports Tailwind breakpoints.',
        },
        {
          term: 'Fixed Item Height',
          explanation:
            'Each cell constrained to itemHeight for accurate scroll calculations.',
        },
        {
          term: 'Overscan Rows',
          explanation:
            'Extra rows rendered off-screen prevent flashes during fast scroll.',
        },
        {
          term: 'Keyboard Navigation',
          explanation: 'Arrow keys, Home/End, PageUp/Down for full keyboard control.',
        },
      ]}
      relatedHooks={[
        {
          name: 'useVirtualList',
          path: '/hooks/use-virtual-list',
          description:
            'Core virtualization logic for calculating visible ranges and managing scroll position.',
        },
      ]}
      props={[
        {
          name: 'data',
          type: 'T[]',
          default: '-',
          description: 'Array of data items to render in the grid.',
          required: true,
        },
        {
          name: 'rootHeight',
          type: 'number',
          default: '-',
          description: 'Height of the scrollable container in pixels.',
          required: true,
        },
        {
          name: 'itemHeight',
          type: 'number',
          default: '-',
          description:
            'Height of each grid item in pixels. This height is enforced on each cell to ensure accurate scroll calculations.',
          required: true,
        },
        {
          name: 'children',
          type: '(item: T, index: number) => JSX.Element',
          default: '-',
          description:
            'Render function for each grid item. Receives the item and its index in the data array.',
          required: true,
        },
        {
          name: 'class',
          type: 'string',
          default: '-',
          description:
            'CSS class for the grid container. Must define grid-template-columns to specify the number of columns (e.g., "grid grid-cols-3").',
        },
        {
          name: 'gap',
          type: 'number',
          default: '0',
          description: 'Gap between grid items in pixels.',
        },
        {
          name: 'overscanRows',
          type: 'number',
          default: '2',
          description:
            'Number of rows to render outside the visible area for smoother scrolling.',
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: 'Accessible label describing the grid content.',
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: 'ID of an element that labels the grid.',
        },
      ]}
      playground={`
import { VirtualGrid } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [selectedId, setSelectedId] = createSignal(null);

  const products = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    name: \`Product \${i + 1}\`,
    price: Math.floor(Math.random() * 100) + 10,
  }));

  return (
    <div class="space-y-4">
      <p class="text-sm text-neutral-600">
        {selectedId() !== null
          ? \`Selected: Product \${selectedId() + 1}\`
          : 'Click a product to select it. Use arrow keys, Home, End, PageUp, PageDown to navigate.'}
      </p>

      <div style={{ width: '450px' }}>
        <VirtualGrid
          data={products}
          rootHeight={350}
          itemHeight={100}
          gap={12}
          overscanRows={3}
          class="grid grid-cols-3"
          aria-label="Product catalog"
        >
          {(product) => (
            <div
              class={\`flex h-full cursor-pointer flex-col justify-between rounded p-3 shadow transition-colors \${
                selectedId() === product.id
                  ? 'border-2 border-blue-500 bg-blue-50'
                  : 'border-2 border-transparent bg-white hover:border-neutral-300'
              }\`}
              onClick={() => setSelectedId(product.id)}
            >
              <h3 class="font-medium">{product.name}</h3>
              <p class="text-lg text-green-600">\${product.price}</p>
            </div>
          )}
        </VirtualGrid>
      </div>
    </div>
  );
}
`}
      usage={`
        import { VirtualGrid } from '@kayou/ui';

        <VirtualGrid data={items} rootHeight={400} itemHeight={100} gap={16} class="grid grid-cols-3" aria-label="Grid">{(item) => <div>{item.name}</div>}</VirtualGrid>
        <VirtualGrid data={items} rootHeight={500} itemHeight={150} class="grid grid-cols-2 md:grid-cols-4">{(item) => <Card item={item} />}</VirtualGrid>
      `}
    />
  );
}
