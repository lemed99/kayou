import { createSignal } from 'solid-js';

import { VirtualGrid } from '@exowpee/solidly-pro';

import DocPage from '../../components/DocPage';

// Sample data generators
const generateProducts = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    image: `https://picsum.photos/seed/${i}/200/150`,
  }));

const generateImages = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    id: i,
    src: `https://picsum.photos/seed/${i + 100}/300/200`,
    alt: `Image ${i + 1}`,
  }));

export default function VirtualGridPage() {
  return (
    <DocPage
      title="VirtualGrid"
      description="Virtualized grid rendering only visible items with CSS-driven column detection and keyboard navigation."
      keyConcepts={[
        {
          term: 'CSS-Driven Columns',
          explanation: 'Column count from CSS class (e.g., "grid-cols-3"); supports Tailwind breakpoints.',
        },
        {
          term: 'Fixed Item Height',
          explanation: 'Each cell constrained to itemHeight for accurate scroll calculations.',
        },
        {
          term: 'Overscan Rows',
          explanation: 'Extra rows rendered off-screen prevent flashes during fast scroll.',
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
      examples={[
        {
          title: 'Basic Product Grid',
          description:
            'A simple product grid with 3 columns. The column count is determined by the CSS class.',
          code: `const products = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  name: \`Product \${i + 1}\`,
  price: Math.floor(Math.random() * 100) + 10,
}));

<VirtualGrid
  data={products}
  rootHeight={400}
  itemHeight={120}
  gap={16}
  class="grid grid-cols-3"
  aria-label="Product catalog"
>
  {(product) => (
    <div class="bg-white p-4 rounded shadow">
      <h3>{product.name}</h3>
      <p>\${product.price}</p>
    </div>
  )}
</VirtualGrid>`,
          component: () => {
            const products = generateProducts(100);
            return (
              <div style={{ width: '400px' }}>
                <VirtualGrid
                  data={products}
                  rootHeight={300}
                  itemHeight={100}
                  gap={12}
                  class="grid grid-cols-3"
                  aria-label="Product catalog"
                >
                  {(product) => (
                    <div class="flex h-full flex-col justify-between rounded bg-white p-3 shadow">
                      <h3 class="font-medium">{product.name}</h3>
                      <p class="text-lg text-green-600">${product.price}</p>
                    </div>
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'Image Gallery',
          description: 'A responsive image gallery with 4 columns.',
          code: `const images = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  src: \`https://picsum.photos/seed/\${i}/300/200\`,
  alt: \`Image \${i + 1}\`,
}));

<VirtualGrid
  data={images}
  rootHeight={500}
  itemHeight={150}
  gap={8}
  class="grid grid-cols-4"
  aria-label="Image gallery"
>
  {(image) => (
    <img
      src={image.src}
      alt={image.alt}
      class="w-full h-full object-cover rounded"
    />
  )}
</VirtualGrid>`,
          component: () => {
            const images = generateImages(200);
            return (
              <div style={{ width: '450px' }}>
                <VirtualGrid
                  data={images}
                  rootHeight={350}
                  itemHeight={120}
                  gap={8}
                  class="grid grid-cols-4"
                  aria-label="Image gallery"
                >
                  {(image) => (
                    <img
                      src={image.src}
                      alt={image.alt}
                      class="h-full w-full rounded object-cover"
                      loading="lazy"
                    />
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'Selectable Grid',
          description:
            'Grid with selection state. Use keyboard navigation: Arrow keys, Home, End, PageUp, PageDown.',
          code: `const [selectedId, setSelectedId] = createSignal<number | null>(null);
const items = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  label: \`Item \${i + 1}\`,
}));

<VirtualGrid
  data={items}
  rootHeight={300}
  itemHeight={80}
  gap={8}
  class="grid grid-cols-4"
  aria-label="Selectable items"
>
  {(item) => (
    <div
      class={selectedId() === item.id ? 'bg-blue-100 border-blue-500' : 'bg-white'}
      onClick={() => setSelectedId(item.id)}
    >
      {item.label}
    </div>
  )}
</VirtualGrid>`,
          component: () => {
            const [selectedId, setSelectedId] = createSignal<number | null>(null);
            const items = Array.from({ length: 50 }, (_, i) => ({
              id: i,
              label: `Item ${i + 1}`,
            }));

            return (
              <div style={{ width: '400px' }}>
                <VirtualGrid
                  data={items}
                  rootHeight={280}
                  itemHeight={60}
                  gap={8}
                  class="grid grid-cols-4"
                  aria-label="Selectable items"
                >
                  {(item) => (
                    <div
                      class={`flex h-full cursor-pointer items-center justify-center rounded border-2 transition-colors ${
                        selectedId() === item.id
                          ? 'border-blue-500 bg-blue-100'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      {item.label}
                    </div>
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'Two Column Layout',
          description: 'Grid with 2 columns for larger items like cards.',
          code: `<VirtualGrid
  data={items}
  rootHeight={400}
  itemHeight={150}
  gap={16}
  class="grid grid-cols-2"
  aria-label="Card list"
>
  {(item, index) => (
    <div class="bg-white p-4 rounded-lg shadow">
      <h3>Card #{index + 1}</h3>
      <p>{item.description}</p>
    </div>
  )}
</VirtualGrid>`,
          component: () => {
            const items = Array.from({ length: 30 }, (_, i) => ({
              id: i,
              title: `Card ${i + 1}`,
              description: `This is the description for card ${i + 1}. It contains some details about the item.`,
            }));

            return (
              <div style={{ width: '400px' }}>
                <VirtualGrid
                  data={items}
                  rootHeight={300}
                  itemHeight={100}
                  gap={12}
                  class="grid grid-cols-2"
                  aria-label="Card list"
                >
                  {(item) => (
                    <div class="h-full rounded-lg bg-white p-3 shadow">
                      <h3 class="font-medium">{item.title}</h3>
                      <p class="mt-1 text-sm text-gray-600">{item.description}</p>
                    </div>
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'No Gap Grid',
          description: 'Grid without gaps, useful for seamless layouts.',
          code: `<VirtualGrid
  data={colors}
  rootHeight={300}
  itemHeight={60}
  gap={0}
  class="grid grid-cols-5"
  aria-label="Color palette"
>
  {(color) => (
    <div style={{ background: color.hex }} class="h-full" />
  )}
</VirtualGrid>`,
          component: () => {
            const colors = Array.from({ length: 100 }, (_, i) => ({
              id: i,
              hex: `hsl(${(i * 3.6) % 360}, 70%, 60%)`,
            }));

            return (
              <div style={{ width: '350px' }}>
                <VirtualGrid
                  data={colors}
                  rootHeight={240}
                  itemHeight={60}
                  gap={0}
                  class="grid grid-cols-5"
                  aria-label="Color palette"
                >
                  {(color) => (
                    <div class="h-full w-full" style={{ background: color.hex }} />
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'With Custom Overscan',
          description: 'Increase overscan rows for smoother scrolling on fast scroll.',
          code: `<VirtualGrid
  data={items}
  rootHeight={400}
  itemHeight={100}
  gap={8}
  overscanRows={4}
  class="grid grid-cols-3"
  aria-label="Items with overscan"
>
  {(item) => <div>{item.name}</div>}
</VirtualGrid>`,
          component: () => {
            const items = Array.from({ length: 150 }, (_, i) => ({
              id: i,
              name: `Item ${i + 1}`,
            }));

            return (
              <div style={{ width: '350px' }}>
                <VirtualGrid
                  data={items}
                  rootHeight={250}
                  itemHeight={60}
                  gap={8}
                  overscanRows={4}
                  class="grid grid-cols-3"
                  aria-label="Items with overscan"
                >
                  {(item) => (
                    <div class="flex h-full items-center justify-center rounded bg-gray-100">
                      {item.name}
                    </div>
                  )}
                </VirtualGrid>
              </div>
            );
          },
        },
        {
          title: 'Empty State',
          description: 'Grid handles empty data gracefully.',
          code: `<VirtualGrid
  data={[]}
  rootHeight={200}
  itemHeight={100}
  class="grid grid-cols-3"
  aria-label="Empty grid"
>
  {(item) => <div>{item}</div>}
</VirtualGrid>`,
          component: () => {
            const [items, setItems] = createSignal<{ id: number; name: string }[]>([]);
            const [hasItems, setHasItems] = createSignal(false);

            return (
              <div class="space-y-3">
                <button
                  onClick={() => {
                    setHasItems(!hasItems());
                    setItems(
                      hasItems()
                        ? Array.from({ length: 20 }, (_, i) => ({
                            id: i,
                            name: `Item ${i + 1}`,
                          }))
                        : [],
                    );
                  }}
                  class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                >
                  Toggle Items
                </button>
                <div class="relative" style={{ width: '350px' }}>
                  <VirtualGrid
                    data={items()}
                    rootHeight={200}
                    itemHeight={60}
                    gap={8}
                    class="grid grid-cols-3"
                    aria-label="Toggleable grid"
                  >
                    {(item) => (
                      <div class="flex h-full items-center justify-center rounded bg-white shadow">
                        {item.name}
                      </div>
                    )}
                  </VirtualGrid>
                  {items().length === 0 && (
                    <div class="absolute inset-0 flex items-center justify-center text-gray-500">
                      No items to display
                    </div>
                  )}
                </div>
              </div>
            );
          },
        },
      ]}
      usage={`import { VirtualGrid } from '@exowpee/solidly;

// Basic usage - columns defined by CSS class
<VirtualGrid
  data={items}
  rootHeight={400}
  itemHeight={100}
  gap={16}
  class="grid grid-cols-3"
  aria-label="My grid"
>
  {(item, index) => (
    <div class="bg-white p-4 rounded shadow">
      <h3>{item.name}</h3>
      <p>Index: {index}</p>
    </div>
  )}
</VirtualGrid>

// Responsive columns with Tailwind
<VirtualGrid
  data={items}
  rootHeight={500}
  itemHeight={150}
  gap={12}
  class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  aria-label="Responsive grid"
>
  {(item) => <Card item={item} />}
</VirtualGrid>

// Image gallery
<VirtualGrid
  data={images}
  rootHeight={600}
  itemHeight={200}
  gap={8}
  class="grid grid-cols-4"
  aria-label="Photo gallery"
>
  {(image) => (
    <img
      src={image.src}
      alt={image.alt}
      class="w-full h-full object-cover"
      loading="lazy"
    />
  )}
</VirtualGrid>

// Important: Item Height Enforcement
// ----------------------------------
// Each grid cell has enforced height (itemHeight) with overflow hidden.
// This ensures scroll calculations are always accurate.
// Design your cell content to fit within itemHeight.

// Keyboard Navigation:
// - Arrow keys: Navigate between cells
// - Home: Go to start of current row (Ctrl+Home: first item)
// - End: Go to end of current row (Ctrl+End: last item)
// - PageUp/PageDown: Navigate by visible rows

// Accessibility:
// - role="grid" on container
// - role="gridcell" on each item
// - aria-rowcount, aria-colcount on container
// - aria-rowindex, aria-colindex on each cell
// - Focusable cells with roving tabindex`}
    />
  );
}
