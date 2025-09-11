import type { Component } from 'solid-js';
import { For, Show, createMemo, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

import Accordion from '../components/Accordion';
import Alert from '../components/Alert';
import Button, { ButtonColor } from '../components/Button';
import {
  CartesianGrid,
  Line,
  LineChart,
  LineChartTooltip,
  XAxis,
  YAxis,
} from '../components/Charts/LineCharts';
import { Pie, PieChart, Sector } from '../components/Charts/PieChart';
import { ResponsiveContainer } from '../components/Charts/ResponsiveContainer';
import { ActiveSector } from '../components/Charts/types';
import Checkbox from '../components/Checkbox';
import DataTable, { DataTableColumnProps } from '../components/DataTable';
import Drawer from '../components/Drawer';
import NumberInput from '../components/NumberInput';
import { Pagination } from '../components/Pagination';
import Popover from '../components/Popover';
import Select from '../components/Select';
import SelectWithSearch from '../components/SelectWithSearch';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Tooltip from '../components/Tooltip';
import ToastProvider, { toast } from '../context/toast';
import { useIntl } from '../hooks/useIntl';
import { useTheme } from '../hooks/useTheme';
import { InformationCircleIcon } from '../icons';
import DatePicker from './../components/DatePicker';

const data = [
  { name: 'Page A', uv: 4000, pv: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398 },
  { name: 'Page C', uv: 2000, pv: 9800 },
  { name: 'Page D', uv: 2780, pv: 3908 },
  { name: 'Page E', uv: 1890, pv: 4800 },
  { name: 'Page F', uv: 2390, pv: 3800 },
  { name: 'Page G', uv: 3490, pv: 4300 },
];

const datac = [
  { name: 'DOLAIT NATURE 125G [ut]', value: 300 },
  { name: 'Product 2', value: 500 },
  { name: 'Product 3', value: 1000 },
  { name: 'Product 4', value: 5600 },
];

const DrawerExample = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  const openDrawer = () => setIsOpen(true);
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
        position="right"
        widthClass="w-1/2"
        heightClass="h-4/5"
        backdropType="blurry"
        closeOnBackdropClick={true}
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

const SelectWithSearchDemo = () => {
  const [selectedProduct, setSelectedProduct] = createSignal(null);

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
  ];

  const handleSelect = (option) => {
    setSelectedProduct(option);
    console.log('Selected:', option);
  };

  const handleClear = () => {
    setSelectedProduct(null);
    console.log('Selection cleared');
  };

  return (
    <div class="p-4">
      <h2 class="mb-2 font-bold">Select a Product</h2>
      <SelectWithSearch
        options={productOptions}
        onSelect={handleSelect}
        onClear={handleClear}
        placeholder="Search products..."
        autoFillSearchKey
        target="products"
      />
      <div class="mt-4">
        <strong>Selected Product:</strong>{' '}
        {selectedProduct() ? selectedProduct().label : 'None'}
      </div>
    </div>
  );
};

const ToastExample = () => {
  const [toastType, setToastType] = createSignal<ButtonColor>('success');
  const types = ['success', 'failure', 'warning', 'info'] as ButtonColor[];

  const toastText = createMemo(() => {
    return `This is a ${toastType()} toast`;
  });

  const handleToast = () => {
    if (toastType() === 'success') {
      toast.success(toastText());
    } else if (toastType() === 'failure') {
      toast.error(toastText());
    } else if (toastType() === 'warning') {
      toast.warning(toastText());
    } else if (toastType() === 'info') {
      toast.info(toastText());
    }
  };

  return (
    <div>
      <ToastProvider />
      <div class="flex flex-wrap gap-4 p-4">
        <For each={types}>
          {(type) => (
            <Checkbox
              label={type}
              labelClass="text-sm capitalize"
              checked={toastType() === type}
              onChange={() => setToastType(type)}
            />
          )}
        </For>
      </div>

      <div class="flex flex-col gap-4">
        <Button color={'gray'} onClick={handleToast}>
          Show toast {toastType()}
        </Button>

        <Button
          color={'gray'}
          class="mt-4"
          onClick={() => {
            toast.custom(
              <div class="rounded bg-purple-50 p-4 text-purple-900 shadow">
                <strong>✨ Custom Toast:</strong> You can put anything here!
              </div>,
              { duration: 5000, position: 'top-right', hideProgressBar: true },
            );
          }}
        >
          Show custom toast
        </Button>
      </div>
    </div>
  );
};

const App: Component = () => {
  // console.log("rendered");
  const [openPanels, setOpenPanels] = createStore({
    intro: true, // Panel with key "intro" starts open
    details: false,
    summary: false,
  });
  const accordionPanels = [
    {
      itemKey: 'intro',
      title: <h3 class="font-medium">Introduction</h3>,
      content: (
        <p>
          This is an introduction to our product. It covers the basics you need to know.
        </p>
      ),
    },
    {
      itemKey: 'details',
      title: <h3 class="font-medium">Technical Details</h3>,
      content: (
        <div>
          <p>Here are the technical specifications:</p>
          <ul class="mt-2 list-disc pl-5">
            <li>Specification 1</li>
            <li>Specification 2</li>
            <li>Specification 3</li>
          </ul>
        </div>
      ),
    },
    {
      itemKey: 'summary',
      title: <h3 class="font-medium">Summary</h3>,
      content: <p>This is a brief summary of everything covered above.</p>,
    },
  ];
  const openAllPanels = () => {
    setOpenPanels({
      intro: true,
      details: true,
      summary: true,
    });
  };

  // Function to close all panels
  const closeAllPanels = () => {
    setOpenPanels({
      intro: false,
      details: false,
      summary: false,
    });
  };
  const [page, setPage] = createSignal(1);

  const { setAppTheme } = useTheme();
  const intl = useIntl();
  const columns: DataTableColumnProps[] = [
    {
      label: intl.formatMessage({
        defaultMessage: 'Nom du magasin',
        id: 'WRlTuQ',
      }),
      key: 'name',
      render: (value: any, record: any) => (
        <div class="flex gap-2">
          <div>{value}</div>
        </div>
      ),
    },
    {
      label: (
        <span>
          {intl.formatMessage({ defaultMessage: 'Capacité', id: 'h7BEoK' })}{' '}
          <span class="lowercase">
            {intl.formatMessage({ defaultMessage: '(en m³)', id: 'XERdqL' })}
          </span>
        </span>
      ),
      key: 'capacity',
      render: (value: any) => <span>{value || '-'}</span>,
    },
    {
      label: intl.formatMessage({ defaultMessage: 'État', id: 'y/yRqG' }),
      key: 'locked',
      render: (value: any) =>
        value.value ? (
          <div class="flex items-center">
            <span class="mr-1 block h-3 w-3 rounded-full bg-red-500" />{' '}
            {intl.formatMessage({ defaultMessage: 'Bloqué', id: '8EcCxk' })}
          </div>
        ) : (
          <div class="flex items-center">
            <span class="mr-1 block h-3 w-3 rounded-full bg-green-500" />{' '}
            {intl.formatMessage({ defaultMessage: 'Ouvert', id: 'J0NBI8' })}
          </div>
        ),
    },
  ];

  const stores = [
    {
      id: 20,
      created_at: 1689062524461,
      name: 'Magasin principal',
      company_id: 14,
      capacity: 89,
      deleted_at: null,
      env: 'prod',
      locked: {
        value: false,
        reason: 'cuohoi',
      },
    },
    {
      id: 33,
      created_at: 1702327696122,
      name: 'Sonama',
      company_id: 14,
      capacity: 0,
      deleted_at: null,
      env: 'prod',
      locked: {
        value: true,
        reason: '',
      },
    },
    {
      id: 30,
      created_at: 1694742677214,
      name: 'Test',
      company_id: 14,
      capacity: 0,
      deleted_at: null,
      env: 'prod',
      locked: {
        value: false,
        reason: '',
      },
    },
  ];

  const [date, setDate] = createSignal<string>('2024-06-01');

  const RenderActiveShape = (props: ActiveSector) => {
    const { appTheme } = useTheme();
    const intl = useIntl();

    return (
      <g>
        <text
          x={props.cx}
          y={props.cy}
          dy={-40}
          text-anchor="middle"
          fill={appTheme() === 'light' ? '#333' : '#bbb'}
        >
          {intl.formatMessage({ defaultMessage: 'Total', id: 'MJ2jZQ' })}
        </text>
        <text
          x={props.cx}
          y={props.cy}
          dy={-15}
          text-anchor="middle"
          fill={appTheme() === 'light' ? '#333' : '#bbb'}
          class="text-xl font-bold"
        >
          {props.value}
        </text>

        <Show when={true}>
          <text
            x={props.cx}
            y={props.cy}
            dy={15}
            text-anchor="middle"
            fill={appTheme() === 'light' ? '#333' : '#bbb'}
          >
            {intl.formatMessage({ defaultMessage: 'Réductions', id: 'njfvDL' })}
          </text>
          <text
            x={props.cx}
            y={props.cy}
            dy={40}
            text-anchor="middle"
            fill={appTheme() === 'light' ? '#333' : '#bbb'}
            class="text-xl font-bold"
          >
            {0}
          </text>
        </Show>

        {/* <Sector
        cx={props.cx}
        cy={props.cy}
        innerRadius={props.innerRadius}
        outerRadius={props.outerRadius}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        fill={props.fill}
      /> */}
        <g transform={`translate(${props.cx},${props.cy})`}>
          <Sector
            startAngle={props.startAngle}
            endAngle={props.endAngle}
            innerRadius={props.outerRadius + 9}
            outerRadius={props.outerRadius + 11}
            fill={props.fill}
          />
        </g>

        {/* Line and circle decorations */}
        <path
          d={`M${props.cx + 150},${props.cy}L${props.cx + 170},${props.cy}`}
          stroke={props.fill}
          fill="none"
        />
        <path
          d={`M${props.cx + 170},${props.cy - 40}L${props.cx + 170},${props.cy + 40}`}
          stroke={props.fill}
          fill="none"
        />
        <circle cx={props.cx + 150} cy={props.cy} r={2} fill={props.fill} stroke="none" />

        {/* Labels */}
        {/* <text
        x={props.cx + 180}
        y={props.cy - 20}
        text-anchor="start"
        fill={appTheme() === 'light' ? '#333' : '#bbb'}
      >
        <title>{props.payload.name}</title>
      </text>

      <text
        x={props.cx + 180}
        y={props.cy}
        text-anchor="start"
        fill={appTheme() === 'light' ? '#333' : '#bbb'}
      >
        <tspan class="text-sm">
          {intl.formatMessage({ defaultMessage: 'Quantité :', id: 'cIWY4F' })}{' '}
        </tspan>
        <tspan class="font-bold">{props.payload.quantity}</tspan>
        <title>
          {intl.formatMessage({ defaultMessage: 'Quantité :', id: 'cIWY4F' })}{' '}
          {props.payload.quantity}
        </title>
      </text> */}

        <text
          x={props.cx + 180}
          y={props.cy + 20}
          text-anchor="start"
          fill={appTheme() === 'light' ? '#333' : '#bbb'}
        >
          <tspan class="text-sm">
            {intl.formatMessage({ defaultMessage: 'Montant :', id: 'Ynbd4d' })}{' '}
          </tspan>
          <tspan class="font-bold">{props.value}</tspan>
          <title>
            {intl.formatMessage({ defaultMessage: 'Montant :', id: 'Ynbd4d' })}{' '}
            {props.value}
          </title>
        </text>

        <text
          x={props.cx + 180}
          y={props.cy + 40}
          text-anchor="start"
          fill={appTheme() === 'light' ? '#333' : '#bbb'}
        >
          <tspan class="text-sm">
            {intl.formatMessage({ defaultMessage: 'Pourcentage :', id: 'QO5TWi' })}{' '}
          </tspan>
          <tspan class="font-bold">{`${(props.percent * 100).toFixed(2)}%`}</tspan>
          <title>
            {intl.formatMessage({ defaultMessage: 'Pourcentage :', id: 'QO5TWi' })}{' '}
            {`${(props.percent * 100).toFixed(2)}%`}
          </title>
        </text>
      </g>
    );
  };

  return (
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
          addon="CFA"
          label="Label"
          onChange={(e) => console.log(e.target.value)}
          helperText="Un helper text"
        />
        <Textarea
          label="Label"
          onChange={(e) => console.log(e.target.value)}
          helperText="Un helper text"
          color="info"
        />
        <div class="mb-4 flex space-x-4">
          <button
            class="rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
            onClick={openAllPanels}
          >
            Open All
          </button>
          <button
            class="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
            onClick={closeAllPanels}
          >
            Close All
          </button>
        </div>
        <Accordion
          panels={accordionPanels}
          itemDetails={openPanels}
          setItemDetails={setOpenPanels}
          simple={false}
        />
        <DrawerExample />
        <Select
          color="info"
          sizing="md"
          helperText="Choose an option"
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
          ]}
        />
        <Checkbox label="Checkbox" />
        <Button onclick={() => setAppTheme('light')}>Light</Button>
        <Button onclick={() => setAppTheme('dark')}>Dark</Button>
        <Button onclick={() => setAppTheme('system')}>System</Button>
        <div class="fixed right-4 bottom-4 z-50 w-fit">
          <Tooltip content="This is a tooltip" style="auto">
            <Button color="dark">me</Button>
          </Tooltip>
        </div>
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
        <SelectWithSearchDemo />
        <ToastExample />
        <div class="mt-4 flex flex-col gap-3">
          <h2 class="text-lg font-bold">Pagination</h2>
          <Pagination
            total={15}
            currentPage={page()}
            onPageChange={setPage}
            siblingCount={1}
            boundaryCount={1}
          />
        </div>
      </div>
      <div class="h-max w-full px-8 pb-16 dark:text-gray-200">
        <div>
          <DataTable
            rowSelection={true}
            object={stores}
            loading={false}
            // error={new Error("Error loading data")}
            error={null}
            columns={columns}
            // requestParams={requestParams}
            // setRequestParams={handleRequestParamsChange}
            // updateURL={updateURL}
          />
        </div>
      </div>
      <div class="h-[340px] min-h-[200px] w-1/2 p-8">
        <ResponsiveContainer>
          {(size) => (
            <LineChart width={730} height={250} data={data} {...size}>
              <CartesianGrid />
              <XAxis dataKey="name" tickFormatter={() => ''} />
              <YAxis />
              <LineChartTooltip
              // content={(data) => <pre>{JSON.stringify(data, null, 2)}</pre>}
              />
              <Line dataKey="pv" stroke="#8884d8" dot />
              <Line dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      <div class="h-[440px] min-h-[200px] w-1/2 p-8">
        <ResponsiveContainer>
          {(size) => (
            <PieChart width={300} height={300} {...size}>
              <Pie
                data={datac}
                dataKey="value"
                cx={160}
                cy="50%"
                innerRadius={120}
                outerRadius={140}
                fill="#8884d8"
                activeShape={RenderActiveShape}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div class="mb-16 max-w-sm p-8 text-sm">
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
            setDate(newValue?.date as string);
            console.log('Selected:', newValue);
          }}
          popoverPosition="bottom"
          // minDate="2025-09-07"
          // maxDate="2025-09-20"
        />
      </div>

      <div class="max-w-lg p-8">
        <Alert color="failure" icon={InformationCircleIcon}>
          <div>
            <div>This is an alert — check it out!</div>
            {/* <div>This is an alert — check it out!</div>
            <div>This is an alert — check it out!</div> */}
          </div>
        </Alert>
      </div>
    </>
  );
};

export default App;
