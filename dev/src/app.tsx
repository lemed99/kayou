import { type Component, createEffect, createSignal, Show } from 'solid-js';

import { Portal } from 'solid-js/web';
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  DataTable,
  DatePicker,
  Drawer,
  Modal,
  MultiSelect,
  NumberInput,
  Pagination,
  Popover,
  Select,
  Sidebar,
  SideBarItems,
  Textarea,
  TextInput,
  ToggleSwitch,
  Tooltip,
  UploadFile,
  VirtualGrid,
  VirtualList
} from '../../src';
import { DatePickerProvider } from '../../src/context/DatePickerContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { ToastAPI } from '../../src/context/ToastContext';
import { useCustomResource, useFloating, useMutation } from '../../src/hooks';
import { useToast } from '../../src/hooks/useToast';
import { CheckCircleIcon, InfoCircleIcon, SunIcon } from '../../src/icons';

const defaultFetcher = async (url, arg) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(arg),
    });
    
    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(errorData || `HTTP ${res.status}`);
    }
    
    return (await res.json());
};
  
const items: SideBarItems[] = [
  {
    label: 'Home',
    icon: SunIcon,
    // isActive: true,
    id: 'home',
    onClick: () => alert('Home clicked'),
  },
  {
    label: 'Settings',
    icon: InfoCircleIcon,
    // isActive: true,
    id: 'settings',
    children: [
      {
        label: 'Profile',
        id: 'profile',
        onClick: () => alert('Profile clicked'),
      },
      {
        label: 'Security',
        id: 'security',
        isActive: true,
        onClick: () => alert('Security clicked'),
      },
    ],
  },
  {
    label: 'Home',
    icon: SunIcon,
    // isActive: true,
    id: 'home',
    onClick: () => alert('Home clicked'),
  },
];

const SelectWithSearchDemo = () => {
  const [selectedProduct, setSelectedProduct] = createSignal(null);
  const [isLazyLoading, setIsLazyLoading] = createSignal(false);

  const productOptions = [
    // 🍎 Smartphones
    {
      label: 'Apple',
      value: {
        id: '1',
        sku: 'APL-IP14PM',
        gtin: '1234567890123',
      },
    },
    {
      label: 'Samsung',
      value: {
        id: '2',
        sku: 'SMS-GS23U',
        gtin: '1234567890456',
      },
    },
    {
      label: 'Google',
      value: {
        id: '3',
        sku: 'GGL-PX7P',
        gtin: '1234567890789',
      },
    },
  ];

  const [productOption, setProductOptions] = createSignal([...productOptions]);

  const handleSelect = (option) => {
    setSelectedProduct(option);
    // console.log('Selected:', option);
    console.log('All Selected:', option);
  };

  const [clearValues, setClearValues] = createSignal(false);

  setTimeout(() => {
    setClearValues(true);
  }, 5000);

  createEffect(() => {
    if (isLazyLoading()) {
      setTimeout(() => {
        // In a real scenario, fetch and append more options here
        setProductOptions((prev) => [...prev, ...productOptions]);
        setIsLazyLoading(false);
      }, 1500);
    }
  });

  return (
    <div class="">
      <MultiSelect
        // isLoading
        label='Select a Product'
        options={productOption().map((p) => ({
          label: p.label,
          value: p.value.id,
          // labelWrapper: (label) => (
          //   <div class="flex items-center gap-0.5">
          //     <InfoCircleIcon /> {label}
          //   </div>
          // ),
        }))}
        onMultiSelect={handleSelect}
        // onSelect={handleSelect}
        clearValues={clearValues()}
        // values={selectedProduct().map((p) => p.value.id) || []}
        searchPlaceholder="Search products..."
        placeholder="Search products..."
        // autoFillSearchKey
        optionRowHeight={32}
        noSearchResultPlaceholder="No products found"
        // searchPlaceholder="Search productoooos..."
        values={[]}
        withSearch={true}
        // multiple={true}
        // value="leo"
        // idValue="3"
        // cta={
        //   <div
        //     onClick={() => console.log('Add New Product clicked')}
        //     class="p-2 text-sm text-blue-600"
        //   >
        //     Add New Product
        //   </div>
        // }
        // isLazyLoading={isLazyLoading()}
        // onLazyLoad={(scrollProgress) => {
        //   // console.log('Scroll Progress:', scrollProgress);
        //   if (scrollProgress > 80 && !isLazyLoading() && productOption().length < 100) {
        //     setIsLazyLoading(true);
        //     // Simulate loading more options
        //   }
        // }}
        helperText='Search for a product... e.g., "iPhone"'
        // target="products"
      />
      <div class="mt-4 mb-8">
        <strong>Selected Product:</strong>{' '}
        {selectedProduct() ? selectedProduct().label : 'None'}
      </div>
    </div>
  );
};

const [modal, setModal] = createSignal(false);

function VList() {
  // Create 1000 items with varying content length
  const [items] = createSignal(
    Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      height: 50, // random 30–130px
      text: `Item ${i}`, // longer strings = taller items
    })),
  );
  const rows = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    age: 20 + (i % 50),
    bio: 'Lorem ipsum '.repeat((i % 10) + 1), // variable height for dynamic table
  }));

  return (
    <div style="padding: 1rem">
      <h2>Dynamic Virtualized List</h2>

      <VirtualList
        items={items}
        rootHeight={400}
        containerWidth="100%"
        containerPadding={0}
        rowHeight={50} // visible height of container
        overscanCount={3} // render extra items above/below
      >
        {(item, index) => (
          <div
            style={{
              'box-sizing': 'border-box',
              border: '1px solid #ccc',
              padding: '8px',
              margin: '4px 0',
              height: `${item.height}px`, // <— force height
              'background-color': index() % 2 === 0 ? '#f9f9f9' : '#fff',
            }}
          >
            <strong>{item.id}</strong>: {item.text}
          </div>
        )}
      </VirtualList>
    </div>
  );
}

function DemoGrid() {
  const data = Array.from({ length: 1000 }, (_, i) => `Item ${i + 1}`);

  return (
    <VirtualGrid
      data={data}
      rootHeight={400}
      gap={16}
      class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      itemHeight={60}
    >
      {(item) => (
        <div
          style={{
            height: '100%',
            border: '1px solid #ccc',
            padding: '16px',
            'box-sizing': 'border-box',
          }}
        >
          {item}
        </div>
      )}
    </VirtualGrid>
  );
}

const DrawerExample = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const openDrawer = () => {
    setIsOpen(true);
    console.log('cliked');
  };
  const closeDrawer = () => setIsOpen(false);

  return (
    <div class="p-4 space-y-3">
      <h2 class="mb-4 text-xl font-bold">Drawer Component Example</h2>

      <Button
        color='failure'
        onClick={openDrawer}
      >
        Open Drawer!!
        <CheckCircleIcon/>
      </Button>
      <Button
        color='gray'
        onClick={openDrawer}
        isLoading
      >
        Open Drawer!!
      </Button>
      <Button
        color='info'
        onClick={openDrawer}
        isLoading
      >
        Open Drawer!!
      </Button>
      <Button
        color='success'
        onClick={openDrawer}
        disabled
      >
        Open Drawer!!
      </Button>
      <Button
        color='dark'
        onClick={openDrawer}
        isLoading
      >
        Open Drawer!!
      </Button>
      <Button
        color='warning'
        onClick={openDrawer}
        isLoading
      >
        Open Drawer!!
      </Button>
      <Button
        color='blue'
        onClick={openDrawer}
      >
        Open Drawer!!
      </Button>
      <Button
        color='light'
        onClick={openDrawer}
      >
        Open Drawer!!
      </Button>
      {/* <Button
        onClick={() => setModal(true)}
      >
        Open Modal
      </Button> */}

      <Drawer
        show={isOpen()}
        onClose={closeDrawer}
        position="left"
        // widthClass="w-fit"
        // heightClass="h-fit"
        // backdropType="blurry"
        // closeOnBackdropClick={true}
      >
        <div>
          <h3 class="mb-3 text-lg font-semibold">Drawer Content</h3>

          <p class="mb-4">
            This is the content of the drawer. You can put any components or content here.
          </p>

          <div class="space-y-2">
            <div class="rounded bg-gray-100 p-3 dark:bg-gray-700">Item 1</div>
            <div class="rounded bg-gray-100 p-3 dark:bg-gray-700">Item 2</div>
            <div class="rounded bg-gray-100 p-3 dark:bg-gray-700">Item 3</div>
          </div>

          <div class="mt-6">
            <button
              class="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              onClick={closeDrawer}
            >
              Close Drawer
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

const App: Component = () => {
  const toast = useToast() as ToastAPI & {
    success: (msg: string, options?: any) => string;
  };

  const [checked, setChecked] = createSignal(false);
  const [page, setPage] = createSignal(8);

  const [data] = createSignal([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
    { id: 1, name: 'John Doe', email: 'john@example.com', role: ['Admin', 'bbhhf', 'errk'], status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: ['User'], status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: ['Editor', 'uue'], status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: ['User','User','User','User'], status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: ['Admin'], status: 'Active' },
  ]);
  const columns = [
    {
      label: 'ID',
      key: 'id',
      width: 10,
    },
    {
      label: 'Nom',
      key: 'name',
      width: 15,
    },
    {
      label: 'Email',
      key: 'email',
      width: 20,
      tooltip: 'Je suis la'
    },
    {
      label: 'Role',
      key: 'role',
      width: 25,
      // render: (value) => (
      //   <For each={value}>
      //     {(v) => <Badge class='w-fit' color="dark" size="sm">{v}</Badge>}
      //   </For>
      // ),
    },
    {
      label: 'Status',
      key: 'status',
      width: 30,
      render: (value) => (
        <span class={value === 'Active' ? 'text-green-600' : 'text-gray-400'}>
          {String(value)}
        </span>
      ),
    },
  ];

  // const [referenceEl, setReferenceEl] = createSignal<HTMLElement | null>(null);
  // const [floatingEl, setFloatingEl] = createSignal<HTMLElement | null>(null);
  // const [arrowEl, setArrowEl] = createSignal<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = createSignal(false);

  const { refs, floatingStyles, arrowStyles, container } = useFloating(
    {
      placement: 'bottom',
      offset: 0,
      isOpen,
      renderArrow: true,
      arrowOffset: 8
    }
  );

  const [fetch, setFetch] = createSignal(0);


  // setInterval(() => setFetch(true), 2500);

  // for (let i = 0; i < 5; i++) {
  //   useCustomResource({
  //   urlString: () => '/todos/2',
  //   options: {
  //     onSuccess: (data, f) => console.log(JSON.stringify(data), f),
  //   },
  //   // refreshKey: 'todos',
  // })
  // }

  const A = () => {
    const { data } = useCustomResource({
    urlString: () => '/todos/2',
    options: {
      onSuccess: (data) => console.log(1),
    },
    // refreshKey: 'todos',
  });
    return <div>Cool { JSON.stringify(data())}</div>
  }
  const B = () => {
    const { data } = useCustomResource({
    urlString: () => '/todos/2',
    options: {
      onSuccess: (data) => console.log(2),
    },
    // refreshKey: 'todos',
  });
    return <div>Cool { JSON.stringify(data())}</div>
  }
  const C = () => {
    const { data } = useCustomResource({
    urlString: () => '/todos/2',
    options: {
      onSuccess: (data) => console.log(3),
    },
    // refreshKey: 'todos',
  });
    return <div>Cool { JSON.stringify(data())}</div>
  }
  const D = () => {
    setTimeout(() => setFetch(2), 2000)
    const { data } = useCustomResource({
    urlString: () => fetch() ? '/todos/2' : '',
    options: {
      onSuccess: (data,f) => console.log(4, f),
    },
    // refreshKey: 'todos',
  });
    return <div>Cool { JSON.stringify(data())}</div>
  }

  const MyComponent = () => {
  const mutation = useMutation<any, { title: string }>({
    urlString: 'https://cadb807f41d78def396f.free.beeceptor.com/api/users/',
    options: {
      fetcher: defaultFetcher,
      onSuccess: (data) => console.log('Created:', data),
      onError: (error) => console.error('Failed:', error),
    },
  });

  return (
    <div>
      <button onClick={() => mutation.trigger({ title: 'New Todo' })} disabled={mutation.isMutating()}>
        Create Todo
      </button>
      {mutation.data() && <div>Created: {mutation.data()?.title}</div>}
      {mutation.error() && <div>Error: {mutation.error()?.message}</div>}
    </div>
  );
};


  return (
    // <IntlProvider locale="en" messages={{}}>
      <ThemeProvider>
    <DatePickerProvider locale="fr">
        <>
          <div>Bonjour</div>
          <MyComponent/>
          <A/>
          <B/>
          <C/>
          <D/>
        <div class="mt-32 flex items-start max-w-sm flex-col gap-4 p-8 border border-gray-500 h-[500px] overflow-y-auto">
          <Button color="dark">I'm a button</Button>
          <NumberInput
            onChange={(e) => console.log(e.target.value)}
              step={0.5}
              max={40}
            label="Nombre floatant"
            helperText="Un helper text"
            required={true}
            type="float"
              allowNegativeValues={true}
              isLoading
          />
          <TextInput
            // addon="CFA"
              icon={InfoCircleIcon}
              isLoading
              placeholder='coolll'
            label="Label"
            onChange={(e) => console.log(e.target.value)}
            helperText="Un helper text"
          />
            <div class="z-50 w-fit fixed right-4 bottom-4 space-y-2">
              <div>J'existe depuis</div>
              <div>Tu es fou</div>
              <div><Tooltip content="This is a tooltip for a mother fucker" theme="light">
              <Button color="dark">me</Button>
            </Tooltip></div>
            
          </div>
          <Textarea
            label="Label"
            onChange={(e) => console.log(e.target.value)}
            helperText="Un helper text"
              color="info"
              // isLoading
            />
            <button id='opi' class='w-fit bg-blue-200' ref={refs.setReference} onClick={() => setIsOpen(true)}>
              Open Tooltip
            </button>
            <Show when={isOpen()}>
              <Portal mount={container()}>
                <div ref={refs.setFloating} style={floatingStyles()} class='bg-red-500 text-white z-50'>
                  <div class='p-4 space-y-1 h-32 overflow-y-auto'>
                  <div>Tooltip</div>
                  <div>Tooltip</div>
                  <div>Tooltip</div>
                  <div>Tooltip</div>
                  <div>Tooltip</div>
                  <div>Tooltip</div>
                  <div>Tooltip</div></div>
                  <div class='text-black border border-black' ref={refs.setArrow} style={arrowStyles()}>▼</div>
                </div>
              </Portal>
            </Show>

          <Select
              // color="info"
              label="Cool"
              required={true}
              isLoading
            sizing="md"
            helperText="Choose an option"
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },
              { label: 'Option 4', value: '4' },
              { label: 'Option 5', value: '5' },
              { label: 'Option 6', value: '6' },
              { label: 'Option 7', value: '7' },
              { label: 'Option 8', value: '8' },
              { label: 'Option 9', value: '9' },
            ]}
            onSelect={(option) => console.log('Selected:', option)}
              value="2"
          />
          <Checkbox label="Checkbox" />
          {/* <div class="fixed right-4 bottom-4 z-50 w-fit">
          <Tooltip content="This is a tooltip" style="auto">
            <Button color="dark">me</Button>
          </Tooltip>
          </div> */}
          <Popover
            position="top"
            content={
              <div class="p-2">
                <div class="flex cursor-pointer items-center gap-1 rounded px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Cool Vas-y
                </div>
              </div>
            }
          >
            <div class="cursor-pointer rounded border px-1.5 text-center tracking-wider dark:border-gray-700">
              ···
            </div>
          </Popover>
        </div>
            <button class='w-fit bg-blue-200 mt-32' onClick={() => setIsOpen(false)}>
              Close Tooltip
            </button>
        <div class="flex w-full justify-center text-sm">
          <div class="w-full max-w-sm">
            <SelectWithSearchDemo />
              <DatePicker
                // isLoading
                label="Cool"
                helperText='Nice mohsbjh dhjhsjh'
                required
              type="range"
              locale="fr"
                displayFormat="DD/MM/YYYY"
                placeholder='DD/MM/YYYY- DD/MM/YYYY'
              value={{
                // multipleDates: ['2025-09-24', '2025-09-25', '2025-09-19'],
                // date: '2024-06-01',
                // endDate: '2025-09-30',
              }}
              onChange={(newValue) => {
                // setDate(newValue?.date as string);
                console.log('Selected:', newValue);
              }}
              popoverPosition="bottom"
              // minDate="2025-09-07"
              // maxDate="2025-09-20"
            />
            <DrawerExample /><div class="mt-4 flex flex-col gap-3">
          <h2 class="text-lg font-bold">Pagination</h2>
          <Pagination
            total={15}
            page={page()}
            onChange={setPage}
          />
        </div>
            <Modal position="center" show={modal()} onClose={() => setModal(false)}>
              <div class='h-[2000px]'>Je suis la</div>
            </Modal>
          </div>
        </div>
        <div class="max-w-lg space-y-8 p-8">
          <Button
            onClick={() => {
              toast.success('This is a success message!', {
                duration: 3000,
                pauseOnHover: false,
              });
            }}
          >
            Show Success Toast
          </Button>
          <Alert color="failure" icon={InfoCircleIcon}>
            <div>
              <div>This is an alert — check it out!</div>
              {/* <div>This is an alert — check it out!</div>
            <div>This is an alert — check it out!</div> */}
            </div>
          </Alert>
          <ToggleSwitch
            color="dark"
            checked={checked()}
            label="Toggle me"
            onChange={setChecked}
          />
          </div>
          {/* <VList /> */}
          <div class='p-12 text-sm'>
            <UploadFile multiple={true} onChange={(file) => console.log(file)} />
            <div class='my-8'/>
            <Accordion
                simple={false}
                panels={[
                  {
                    itemKey: 'intro',
                    title: <h3 class="font-medium">Introduction</h3>,
                    content: <p>Our flagship product combines cutting-edge technology with sleek design. Built with premium materials, it offers unparalleled performance and reliability.

Key features include advanced processing capabilities, and an intuitive user interface designed for both beginners and experts.</p>,
                  },
                  {
                    itemKey: 'details',
                    title: <h3 class="font-medium">Technical Details</h3>,
                    content: <p>Here are the technical specifications.</p>,
                  },
                ]}
              />
          <DataTable
            data={data()}
            loading={false}
            validating={false}
              error={null}
              // errorMessage={'Cool'}
              defaultColumns={['id', 'name', 'email', 'role']}
            columns={columns}
            rowSelection={true}
            searchBar={true}
              filters={<></>}
              configureColumns={true}
              expandable={true}
              // estimatedRowHeight={52}
              rowHeight={52}
              footer={false}
            pageTotal={15}
            itemsTotal={215}
            perPageControl={true}
            onPageChange={(page) => console.log('Page changed:', page)}
            />
          </div>
          <Sidebar
              items={items}
              isMobile={false}
              innerClass="bg-gray-100 dark:bg-gray-800"
            >
              <div class="mb-2 px-2 text-xs text-gray-500">Custom Section</div>
            </Sidebar>
        <div class="h-[400px]"></div>
      </>
    </DatePickerProvider>
    </ThemeProvider>
    // </IntlProvider>
  );
};

export default App;
