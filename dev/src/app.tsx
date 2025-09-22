import { type Component, createEffect, createSignal } from 'solid-js';

import {
  Alert,
  Button,
  Checkbox,
  DatePicker,
  Drawer,
  Modal,
  NumberInput,
  Popover,
  Select,
  SelectWithSearch,
  TextInput,
  Textarea,
  ToggleSwitch,
  Tooltip,
} from '../../src';
import { DatePickerProvider } from '../../src/context/DatePickerContext';
import { ToastAPI } from '../../src/context/ToastContext';
import { useToast } from '../../src/hooks/useToast';
import { InformationCircleIcon } from '../../src/icons';

const SelectWithSearchDemo = () => {
  const [selectedProduct, setSelectedProduct] = createSignal(null);
  const [isLazyLoading, setIsLazyLoading] = createSignal(false);

  const productOptions = [
    {
      label: 'Apple iPhone 14',
      value: {
        id: '1',
        sku: 'APL-IP14',
        gtin: '1234567890123',
      },
    },
    {
      label: 'Samsung Galaxy S23',
      value: {
        id: '2',
        sku: 'SMS-GS23',
        gtin: '1234567890456',
      },
    },
    {
      label: 'Google Pixel 7',
      value: {
        id: '3',
        sku: 'GGL-PX7',
        gtin: '1234567890789',
      },
    },
    {
      label: 'OnePlus 11',
      value: {
        id: '4',
        sku: 'ONE-11',
        gtin: '1234567890111',
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
      <SelectWithSearch
        options={productOption().map((p) => ({
          label: p.label,
          value: p.value.id,
          // labelWrapper: (label) => (
          //   <div class="flex items-center gap-0.5">
          //     <InformationCircleIcon /> {label}
          //   </div>
          // ),
        }))}
        // onMultiSelect={handleSelect}
        onSelect={handleSelect}
        // clearValues={clearValues()}
        // values={selectedProduct().map((p) => p.value.id) || []}
        placeholder="Search products..."
        autoFillSearchKey
        noSearchResultPlaceholder="No products found"
        // searchPlaceholder="Search productoooos..."
        // values={['2', '3']}
        // withSearch={true}
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
        isLazyLoading={isLazyLoading()}
        onLazyLoad={(scrollProgress) => {
          console.log('Scroll Progress:', scrollProgress);
          if (scrollProgress > 80 && !isLazyLoading() && productOption().length < 100) {
            setIsLazyLoading(true);
            // Simulate loading more options
          }
        }}
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

const DrawerExample = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const openDrawer = () => {
    setIsOpen(true);
    console.log('cliked');
  };
  const closeDrawer = () => setIsOpen(false);

  return (
    <div class="p-4">
      <h2 class="mb-4 text-xl font-bold">Drawer Component Example</h2>

      <button
        class="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={openDrawer}
      >
        Open Drawer!!
      </button>

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

  return (
    // <IntlProvider locale="en" messages={{}}>
    //   <ThemeProvider>
    <DatePickerProvider locale="fr">
      <>
        <div class="flex max-w-sm flex-col gap-4 p-8">
          <Button color="dark">I'm a button</Button>
          <NumberInput
            onChange={(e) => console.log(e.target.value)}
            step={0.5}
            label="Nombre floatant"
            helperText="Un helper text"
            required={true}
            type="float"
            allowNegativeValues={true}
          />
          <TextInput
            // addon="CFA"
            icon={(props) => <InformationCircleIcon class={props.class} />}
            label="Label"
            onChange={(e) => console.log(e.target.value)}
            helperText="Un helper text"
          />
          <div class="fixed right-4 bottom-4 z-50 w-fit">
            <Tooltip content="This is a tooltip" style="light">
              <Button color="dark">me</Button>
            </Tooltip>
          </div>
          <Textarea
            label="Label"
            onChange={(e) => console.log(e.target.value)}
            helperText="Un helper text"
            color="info"
          />
          <Select
            // color="info"
            sizing="md"
            helperText="Choose an option"
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },
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
            <DrawerExample />
            <Modal position="center" show={modal()} onClose={() => setModal(false)}>
              <div>Je suis la</div>
            </Modal>
          </div>
        </div>

        <div class="max-w-lg space-y-8 p-8">
          <Button
            onClick={() => {
              toast.success('This is a success message!', {
                duration: 5000,
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
      </>
    </DatePickerProvider>
    //   </ThemeProvider>
    // </IntlProvider>
  );
};

export default App;
