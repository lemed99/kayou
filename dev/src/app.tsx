import { type Component, createEffect, createSignal, Show } from 'solid-js';

import { Portal } from 'solid-js/web';
import {
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
  Textarea,
  TextInput,
  ToggleSwitch,
  Tooltip,
  VirtualGrid,
  VirtualList
} from '../../src';
import { DatePickerProvider } from '../../src/context/DatePickerContext';
import { ThemeProvider } from '../../src/context/ThemeContext';
import { ToastAPI } from '../../src/context/ToastContext';
import { useFloating } from '../../src/hooks';
import { useToast } from '../../src/hooks/useToast';
import { InformationCircleIcon } from '../../src/icons';

const SelectWithSearchDemo = () => {
  const [selectedProduct, setSelectedProduct] = createSignal(null);
  const [isLazyLoading, setIsLazyLoading] = createSignal(false);

  const productOptions = [
    // 🍎 Smartphones
    {
      label: 'Apple iPhone 14 Pro Max',
      value: {
        id: '1',
        sku: 'APL-IP14PM',
        gtin: '1234567890123',
      },
    },
    {
      label: 'Samsung Galaxy S23 Ultra',
      value: {
        id: '2',
        sku: 'SMS-GS23U',
        gtin: '1234567890456',
      },
    },
    {
      label: 'Google Pixel 7 Pro',
      value: {
        id: '3',
        sku: 'GGL-PX7P',
        gtin: '1234567890789',
      },
    },
    {
      label: 'OnePlus 11 5G',
      value: {
        id: '4',
        sku: 'ONE-115G',
        gtin: '1234567890111',
      },
    },
    {
      label: 'Xiaomi 13 Pro',
      value: {
        id: '5',
        sku: 'XMI-13P',
        gtin: '1234567890222',
      },
    },
    // 💻 Laptops
    {
      label: 'Apple MacBook Pro 14"',
      value: {
        id: '6',
        sku: 'APL-MBP14',
        gtin: '1234567890333',
      },
    },
    {
      label: 'Dell XPS 13',
      value: {
        id: '7',
        sku: 'DLL-XPS13',
        gtin: '1234567890444',
      },
    },
    {
      label: 'HP Spectre x360',
      value: {
        id: '8',
        sku: 'HP-SPX360',
        gtin: '1234567890555',
      },
    },
    {
      label: 'Lenovo ThinkPad X1 Carbon',
      value: {
        id: '9',
        sku: 'LNV-X1C',
        gtin: '1234567890666',
      },
    },
    {
      label: 'Microsoft Surface Laptop 5',
      value: {
        id: '10',
        sku: 'MS-SLP5',
        gtin: '1234567890777',
      },
    },
    // ⌚ Smartwatches & Wearables
    {
      label: 'Apple Watch Series 8',
      value: {
        id: '11',
        sku: 'APL-WS8',
        gtin: '1234567890888',
      },
    },
    {
      label: 'Samsung Galaxy Watch 5 Pro',
      value: {
        id: '12',
        sku: 'SMS-GW5P',
        gtin: '1234567890999',
      },
    },
    {
      label: 'Fitbit Sense 2',
      value: {
        id: '13',
        sku: 'FTB-S2',
        gtin: '1234567891000',
      },
    },
    {
      label: 'Garmin Fenix 7',
      value: {
        id: '14',
        sku: 'GRM-FNX7',
        gtin: '1234567891111',
      },
    },
    {
      label: 'Xiaomi Smart Band 7 Pro',
      value: {
        id: '15',
        sku: 'XMI-SB7P',
        gtin: '1234567891222',
      },
    },
    // 🎧 Audio
    {
      label: 'Apple AirPods Pro 2nd Gen',
      value: {
        id: '16',
        sku: 'APL-APP2',
        gtin: '1234567891333',
      },
    },
    {
      label: 'Sony WH-1000XM5 Headphones',
      value: {
        id: '17',
        sku: 'SNY-M5HP',
        gtin: '1234567891444',
      },
    },
    {
      label: 'Bose QuietComfort Earbuds II',
      value: {
        id: '18',
        sku: 'BSE-QCEB2',
        gtin: '1234567891555',
      },
    },
    {
      label: 'JBL Flip 6 Portable Speaker',
      value: {
        id: '19',
        sku: 'JBL-FLIP6',
        gtin: '1234567891666',
      },
    },
    {
      label: 'Sennheiser Momentum 4 Wireless',
      value: {
        id: '20',
        sku: 'SNH-MMT4',
        gtin: '1234567891777',
      },
    },
    // 📸 Cameras & Gaming
    {
      label: 'Sony PlayStation 5 Console',
      value: {
        id: '21',
        sku: 'SNY-PS5',
        gtin: '1234567891888',
      },
    },
    {
      label: 'Microsoft Xbox Series X',
      value: {
        id: '22',
        sku: 'MS-XBXSX',
        gtin: '1234567891999',
      },
    },
    {
      label: 'Nintendo Switch OLED',
      value: {
        id: '23',
        sku: 'NIN-SWOLED',
        gtin: '1234567892000',
      },
    },
    {
      label: 'Canon EOS R6 Mark II',
      value: {
        id: '24',
        sku: 'CNN-R6M2',
        gtin: '1234567892111',
      },
    },
    {
      label: 'GoPro HERO 11 Black',
      value: {
        id: '25',
        sku: 'GPR-H11B',
        gtin: '1234567892222',
      },
    },
    // 🖥️ Home & Accessories
    {
      label: 'Amazon Echo Dot (5th Gen)',
      value: {
        id: '26',
        sku: 'AMZ-ED5',
        gtin: '1234567892333',
      },
    },
    {
      label: 'Google Nest Hub 2nd Gen',
      value: {
        id: '27',
        sku: 'GGL-NH2',
        gtin: '1234567892444',
      },
    },
    {
      label: 'Logitech MX Master 3S Mouse',
      value: {
        id: '28',
        sku: 'LGT-MXM3S',
        gtin: '1234567892555',
      },
    },
    {
      label: 'TP-Link Deco XE75 Mesh Wi-Fi',
      value: {
        id: '29',
        sku: 'TPL-XE75',
        gtin: '1234567892666',
      },
    },
    {
      label: 'Samsung 65" Neo QLED 4K TV',
      value: {
        id: '30',
        sku: 'SMS-QLED65',
        gtin: '1234567892777',
      },
    },
    // 💻 PC Components
    {
      label: 'NVIDIA GeForce RTX 4080 GPU',
      value: {
        id: '31',
        sku: 'NV-RTX4080',
        gtin: '1234567892888',
      },
    },
    {
      label: 'AMD Ryzen 9 7900X CPU',
      value: {
        id: '32',
        sku: 'AMD-R97900X',
        gtin: '1234567892999',
      },
    },
    {
      label: 'Intel Core i9-14900K CPU',
      value: {
        id: '33',
        sku: 'INT-I914900K',
        gtin: '1234567893000',
      },
    },
    {
      label: 'Corsair Vengeance 32GB DDR5 RAM',
      value: {
        id: '34',
        sku: 'CSR-V32DDR5',
        gtin: '1234567893111',
      },
    },
    {
      label: 'Samsung 990 Pro 2TB NVMe SSD',
      value: {
        id: '35',
        sku: 'SMS-990PRO2T',
        gtin: '1234567893222',
      },
    },
    {
      label: 'Logitech C920 HD Webcam',
      value: {
        id: '36',
        sku: 'LGT-C920',
        gtin: '1234567893333',
      },
    },
    // 🖥️ Monitors & Peripherals
    {
      label: 'LG UltraGear 27" Gaming Monitor',
      value: {
        id: '37',
        sku: 'LG-UG27',
        gtin: '1234567893444',
      },
    },
    {
      label: 'Dell Ultrasharp 34" Curved Monitor',
      value: {
        id: '38',
        sku: 'DLL-US34C',
        gtin: '1234567893555',
      },
    },
    {
      label: 'Razer BlackWidow V4 Keyboard',
      value: {
        id: '39',
        sku: 'RZR-BWV4',
        gtin: '1234567893666',
      },
    },
    {
      label: 'WD My Passport 5TB External HDD',
      value: {
        id: '40',
        sku: 'WD-MP5TB',
        gtin: '1234567893777',
      },
    },
    // 🍎 Tablets
    {
      label: 'Apple iPad Air (5th Gen)',
      value: {
        id: '41',
        sku: 'APL-IPA5',
        gtin: '1234567893888',
      },
    },
    {
      label: 'Samsung Galaxy Tab S9',
      value: {
        id: '42',
        sku: 'SMS-GTS9',
        gtin: '1234567893999',
      },
    },
    {
      label: 'Microsoft Surface Pro 9',
      value: {
        id: '43',
        sku: 'MS-SPRO9',
        gtin: '1234567894000',
      },
    },
    {
      label: 'Amazon Fire HD 10',
      value: {
        id: '44',
        sku: 'AMZ-FHD10',
        gtin: '1234567894111',
      },
    },
    // 💡 Smart Home & Security
    {
      label: 'Ring Video Doorbell Pro 2',
      value: {
        id: '45',
        sku: 'RNG-VDBP2',
        gtin: '1234567894222',
      },
    },
    {
      label: 'Google Nest Cam (Outdoor)',
      value: {
        id: '46',
        sku: 'GGL-NCOUT',
        gtin: '1234567894333',
      },
    },
    {
      label: 'Philips Hue Starter Kit',
      value: {
        id: '47',
        sku: 'PHL-HUEST',
        gtin: '1234567894444',
      },
    },
    {
      label: 'Ecobee Smart Thermostat Premium',
      value: {
        id: '48',
        sku: 'ECB-STP',
        gtin: '1234567894555',
      },
    },
    // ☕ Small Kitchen Appliances
    {
      label: 'Ninja Foodi 6-in-1 Air Fryer',
      value: {
        id: '49',
        sku: 'NJ-AF6IN1',
        gtin: '1234567894666',
      },
    },
    {
      label: 'Keurig K-Elite Coffee Maker',
      value: {
        id: '50',
        sku: 'KRG-KELITE',
        gtin: '1234567894777',
      },
    },
    {
      label: 'Instant Pot Duo Evo Plus',
      value: {
        id: '51',
        sku: 'IP-DUEP',
        gtin: '1234567894888',
      },
    },
    {
      label: 'Vitamix Ascent Series Blender',
      value: {
        id: '52',
        sku: 'VMX-ASB',
        gtin: '1234567894999',
      },
    },
    // 🧹 Home Cleaning Appliances
    {
      label: 'Dyson V15 Detect Vacuum',
      value: {
        id: '53',
        sku: 'DYS-V15D',
        gtin: '1234567895000',
      },
    },
    {
      label: 'iRobot Roomba j7+ Vacuum',
      value: {
        id: '54',
        sku: 'IRBT-RMBJ7P',
        gtin: '1234567895111',
      },
    },
    {
      label: 'Shark Navigator Lift-Away Vacuum',
      value: {
        id: '55',
        sku: 'SHRK-NLAV',
        gtin: '1234567895222',
      },
    },
    // 🔌 Networking & Power
    {
      label: 'Netgear Nighthawk Wi-Fi 6 Router',
      value: {
        id: '56',
        sku: 'NTG-NHW6R',
        gtin: '1234567895333',
      },
    },
    {
      label: 'Anker PowerCore 20000mAh Power Bank',
      value: {
        id: '57',
        sku: 'ANK-PC20K',
        gtin: '1234567895444',
      },
    },
    {
      label: 'Belkin Boost Charge Pro Wireless Charger',
      value: {
        id: '58',
        sku: 'BLKN-BCPWC',
        gtin: '1234567895555',
      },
    },
    // 📺 Entertainment
    {
      label: 'Apple TV 4K (3rd Gen)',
      value: {
        id: '59',
        sku: 'APL-ATV4K3',
        gtin: '1234567895666',
      },
    },
    {
      label: 'Roku Ultra Streaming Player',
      value: {
        id: '60',
        sku: 'RKU-ULTRA',
        gtin: '1234567895777',
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
      <h2 class="mb-2 font-bold">Select a Product</h2>
      <MultiSelect
        options={productOption().map((p) => ({
          label: p.label,
          value: p.value.id,
          // labelWrapper: (label) => (
          //   <div class="flex items-center gap-0.5">
          //     <InformationCircleIcon /> {label}
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
        // helperText='Search for a product... e.g., "iPhone"'
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
        onClick={openDrawer}
      >
        Open Drawer!!
      </Button>
      <Button
        onClick={() => setModal(true)}
      >
        Open Modal
      </Button>

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

  return (
    // <IntlProvider locale="en" messages={{}}>
      <ThemeProvider>
    <DatePickerProvider locale="fr">
        <>
          <div>Bonjour</div>
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
          />
          <TextInput
            // addon="CFA"
            icon={InformationCircleIcon}
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
              type="single"
              locale="fr"
              displayFormat="DD/MM/YYYY"
              value={{
                multipleDates: ['2025-09-24', '2025-09-25', '2025-09-19'],
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
          <Alert color="failure" icon={InformationCircleIcon}>
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
          <DataTable
            data={data()}
            loading={false}
              error={null}
              defaultColumns={['id', 'name', 'email', 'role']}
            columns={columns}
            rowSelection={true}
            searchBar={true}
              filters={<></>}
              configureColumns={true}
              expandable={true}
              // estimatedRowHeight={52}
              rowHeight={52}
            pageTotal={15}
            itemsTotal={215}
            perPageControl={true}
            onPageChange={(page) => console.log('Page changed:', page)}
          /></div>
        <div class="h-[400px]"></div>
      </>
    </DatePickerProvider>
    </ThemeProvider>
    // </IntlProvider>
  );
};

export default App;
