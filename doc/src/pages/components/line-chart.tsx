import {
  CartesianGrid,
  Line,
  LineChart,
  LineChartTooltip,
  XAxis,
  YAxis,
} from '@lib/components/Charts/LineCharts';
import { ResponsiveContainer } from '@lib/components/Charts/ResponsiveContainer';
import DocPage from '../../components/DocPage';

interface SubComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
  required?: boolean;
}

interface SubComponent {
  name: string;
  description: string;
  props: SubComponentProp[];
}

const subComponents: SubComponent[] = [
  {
    name: 'XAxis',
    description:
      'Renders the horizontal axis with category labels. Automatically positions itself at the bottom of the chart area.',
    props: [
      {
        name: 'dataKey',
        type: 'string',
        default: '-',
        description: 'Key in data objects to use for axis labels (required)',
        required: true,
      },
      {
        name: 'tickCount',
        type: 'number',
        default: '-',
        description: 'Maximum number of ticks to display',
      },
      {
        name: 'tickFormatter',
        type: '(v: string | number) => string',
        default: '-',
        description: 'Function to format tick labels',
      },
      {
        name: 'stroke',
        type: 'string',
        default: '"#666"',
        description: 'Color of the axis line and tick marks',
      },
    ],
  },
  {
    name: 'YAxis',
    description:
      'Renders the vertical axis with numeric values. Automatically calculates domain from data and positions on the left.',
    props: [
      {
        name: 'tickCount',
        type: 'number',
        default: '5',
        description: 'Number of ticks to display on the axis',
      },
      {
        name: 'tickFormatter',
        type: '(v: number) => string',
        default: '-',
        description: 'Function to format tick labels (e.g., add currency symbol)',
      },
      {
        name: 'stroke',
        type: 'string',
        default: '"#666"',
        description: 'Color of the axis line and tick marks',
      },
    ],
  },
  {
    name: 'Line',
    description:
      'Renders a data series as a line path. Multiple Line components can be added for comparing series.',
    props: [
      {
        name: 'dataKey',
        type: 'string',
        default: '-',
        description: 'Key in data objects containing the numeric values (required)',
        required: true,
      },
      {
        name: 'stroke',
        type: 'string',
        default: '"#8884d8"',
        description: 'Color of the line',
      },
      {
        name: 'strokeWidth',
        type: 'number',
        default: '2',
        description: 'Width of the line in pixels',
      },
      {
        name: 'dot',
        type: 'boolean',
        default: 'false',
        description: 'Whether to show dots at each data point',
      },
    ],
  },
  {
    name: 'CartesianGrid',
    description:
      'Renders background grid lines to help read values. Can show horizontal, vertical, or both.',
    props: [
      {
        name: 'stroke',
        type: 'string',
        default: '"#ccc"',
        description: 'Color of the grid lines',
      },
      {
        name: 'strokeDasharray',
        type: 'string',
        default: '-',
        description: 'Dash pattern for grid lines (e.g., "5 5" for dashed)',
      },
      {
        name: 'vertical',
        type: 'boolean',
        default: 'true',
        description: 'Whether to show vertical grid lines',
      },
      {
        name: 'horizontal',
        type: 'boolean',
        default: 'true',
        description: 'Whether to show horizontal grid lines',
      },
    ],
  },
  {
    name: 'LineChartTooltip',
    description:
      'Adds an interactive tooltip that appears on hover. Shows a vertical indicator line and displays data values.',
    props: [
      {
        name: 'stroke',
        type: 'string',
        default: '"#ccc"',
        description: 'Color of the vertical indicator line',
      },
      {
        name: 'withLine',
        type: 'boolean',
        default: 'true',
        description: 'Whether to show the vertical indicator line',
      },
      {
        name: 'content',
        type: '(data: Record<string, unknown>) => JSX.Element',
        default: '-',
        description: 'Custom render function for tooltip content',
      },
    ],
  },
];

const salesData = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 2000, profit: 9800 },
  { month: 'Apr', revenue: 2780, profit: 3908 },
  { month: 'May', revenue: 1890, profit: 4800 },
  { month: 'Jun', revenue: 2390, profit: 3800 },
  { month: 'Jul', revenue: 3490, profit: 4300 },
];

const temperatureData = [
  { day: 'Mon', high: 24, low: 18 },
  { day: 'Tue', high: 26, low: 19 },
  { day: 'Wed', high: 28, low: 21 },
  { day: 'Thu', high: 25, low: 17 },
  { day: 'Fri', high: 23, low: 16 },
  { day: 'Sat', high: 27, low: 20 },
  { day: 'Sun', high: 29, low: 22 },
];

const stockData = [
  { date: 'Q1', price: 150.25 },
  { date: 'Q2', price: 162.5 },
  { date: 'Q3', price: 145.75 },
  { date: 'Q4', price: 178.0 },
];

export default function LineChartPage() {
  return (
    <DocPage
      title="LineChart"
      description="LineChart is a composable charting component built on D3.js for rendering line charts with multiple data series, interactive tooltips, and hover states. It uses a compound component pattern where XAxis, YAxis, Line, CartesianGrid, and LineChartTooltip are nested children that share context. The chart automatically calculates scales based on data, supports responsive sizing via ResponsiveContainer, and provides full accessibility with ARIA attributes, keyboard navigation, and screen reader support."
      keyConcepts={[
        {
          term: 'Compound Components',
          explanation:
            'LineChart uses a parent-child pattern where child components (XAxis, YAxis, Line, etc.) access shared state via context. This allows flexible composition - add or remove features by including/excluding child components.',
        },
        {
          term: 'D3 Scales',
          explanation:
            'The chart automatically creates D3 scales (scalePoint for X-axis categories, scaleLinear for Y-axis values) that map data values to pixel coordinates. Scales update reactively when data changes.',
        },
        {
          term: 'Responsive Container',
          explanation:
            'Wrap LineChart in ResponsiveContainer to make it resize with its parent. The container passes rwidth/rheight props that override the base width/height.',
        },
        {
          term: 'Multiple Series',
          explanation:
            'Add multiple Line components with different dataKey props to display several data series on the same chart. Each line can have its own color and styling.',
        },
      ]}
      value="Line charts are essential for visualizing trends over time or across categories. This implementation handles common requirements like multiple series comparison, interactive tooltips, and responsive layouts while maintaining accessibility for all users. The D3-powered rendering ensures smooth curves and accurate data representation."
      props={[
        {
          name: 'width',
          type: 'number',
          default: '-',
          description: 'Base width of the chart in pixels (required)',
          required: true,
        },
        {
          name: 'height',
          type: 'number',
          default: '-',
          description: 'Base height of the chart in pixels (required)',
          required: true,
        },
        {
          name: 'data',
          type: 'Record<string, unknown>[]',
          default: '-',
          description: 'Array of data objects to plot (required)',
          required: true,
        },
        {
          name: 'rwidth',
          type: 'number',
          default: '-',
          description: 'Responsive width override (from ResponsiveContainer)',
        },
        {
          name: 'rheight',
          type: 'number',
          default: '-',
          description: 'Responsive height override (from ResponsiveContainer)',
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '"Line chart"',
          description: 'Accessible label for screen readers',
        },
        {
          name: 'title',
          type: 'string',
          default: '-',
          description: 'SVG title element for accessibility',
        },
        {
          name: 'description',
          type: 'string',
          default: '-',
          description: 'SVG description element for accessibility',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description:
            'Child components (XAxis, YAxis, Line, CartesianGrid, LineChartTooltip)',
        },
      ]}
      examples={[
        {
          title: 'Basic Line Chart',
          description: 'Simple line chart with a single data series.',
          code: `<LineChart data={salesData} width={500} height={300}>
  <XAxis dataKey="month" />
  <YAxis />
  <Line dataKey="revenue" stroke="#8884d8" />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </div>
          ),
        },
        {
          title: 'Multiple Lines',
          description: 'Chart with multiple data series for comparison.',
          code: `<LineChart data={salesData} width={500} height={300}>
  <XAxis dataKey="month" />
  <YAxis />
  <CartesianGrid stroke="#eee" />
  <Line dataKey="revenue" stroke="#8884d8" />
  <Line dataKey="profit" stroke="#82ca9d" />
  <LineChartTooltip />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid stroke="#eee" />
                <Line dataKey="revenue" stroke="#8884d8" />
                <Line dataKey="profit" stroke="#82ca9d" />
                <LineChartTooltip />
              </LineChart>
            </div>
          ),
        },
        {
          title: 'With Dots',
          description: 'Show data points on the line.',
          code: `<LineChart data={temperatureData} width={500} height={300}>
  <XAxis dataKey="day" />
  <YAxis />
  <CartesianGrid strokeDasharray="5 5" />
  <Line dataKey="high" stroke="#ef4444" dot />
  <Line dataKey="low" stroke="#3b82f6" dot />
  <LineChartTooltip />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart data={temperatureData} width={500} height={250}>
                <XAxis dataKey="day" />
                <YAxis />
                <CartesianGrid strokeDasharray="5 5" />
                <Line dataKey="high" stroke="#ef4444" dot />
                <Line dataKey="low" stroke="#3b82f6" dot />
                <LineChartTooltip />
              </LineChart>
            </div>
          ),
        },
        {
          title: 'Custom Tick Formatters',
          description: 'Format axis labels with custom functions.',
          code: `<LineChart data={stockData} width={500} height={300}>
  <XAxis dataKey="date" />
  <YAxis tickFormatter={(v) => \`$\${v}\`} />
  <CartesianGrid stroke="#ddd" />
  <Line dataKey="price" stroke="#10b981" strokeWidth={2} dot />
  <LineChartTooltip />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart data={stockData} width={500} height={250}>
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `$${v}`} />
                <CartesianGrid stroke="#ddd" />
                <Line dataKey="price" stroke="#10b981" strokeWidth={2} dot />
                <LineChartTooltip />
              </LineChart>
            </div>
          ),
        },
        {
          title: 'Responsive Chart',
          description: 'Chart that resizes with its container using ResponsiveContainer.',
          code: `<ResponsiveContainer minHeight={300}>
  {(size) => (
    <LineChart
      data={salesData}
      width={600}
      height={300}
      rwidth={size.rwidth}
      rheight={size.rheight}
    >
      <XAxis dataKey="month" />
      <YAxis />
      <CartesianGrid />
      <Line dataKey="revenue" stroke="#8884d8" />
      <LineChartTooltip />
    </LineChart>
  )}
</ResponsiveContainer>`,
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={250}>
                {(size) => (
                  <LineChart
                    data={salesData}
                    width={600}
                    height={250}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <CartesianGrid />
                    <Line dataKey="revenue" stroke="#8884d8" />
                    <LineChartTooltip />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'Custom Tooltip',
          description: 'Provide a custom tooltip renderer.',
          code: `<LineChart data={salesData} width={500} height={300}>
  <XAxis dataKey="month" />
  <YAxis />
  <Line dataKey="revenue" stroke="#8884d8" />
  <LineChartTooltip
    content={(data) => (
      <div class="bg-white border shadow-lg p-3 rounded">
        <div class="font-bold">{data.month}</div>
        <div class="text-purple-600">
          Revenue: \${data.revenue?.toLocaleString()}
        </div>
      </div>
    )}
  />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line dataKey="revenue" stroke="#8884d8" />
                <LineChartTooltip
                  content={(data) => (
                    <div class="rounded border bg-white p-3 shadow-lg">
                      <div class="font-bold">{String(data.month)}</div>
                      <div class="text-purple-600">
                        Revenue: ${Number(data.revenue).toLocaleString()}
                      </div>
                    </div>
                  )}
                />
              </LineChart>
            </div>
          ),
        },
        {
          title: 'Accessible Chart',
          description: 'Chart with accessibility attributes for screen readers.',
          code: `<LineChart
  data={salesData}
  width={500}
  height={300}
  ariaLabel="Monthly revenue trend for 2024"
  title="Revenue Chart"
  description="Shows monthly revenue from January to July 2024"
>
  <XAxis dataKey="month" />
  <YAxis />
  <Line dataKey="revenue" stroke="#8884d8" />
</LineChart>`,
          component: () => (
            <div class="h-64 w-full">
              <LineChart
                data={salesData}
                width={500}
                height={250}
                ariaLabel="Monthly revenue trend for 2024"
                title="Revenue Chart"
                description="Shows monthly revenue from January to July 2024"
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Line dataKey="revenue" stroke="#8884d8" />
              </LineChart>
            </div>
          ),
        },
      ]}
      usage={`import {
  LineChart,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
  LineChartTooltip,
} from '@exowpee/the_rock/Charts/LineCharts';
import { ResponsiveContainer } from '@exowpee/the_rock/Charts/ResponsiveContainer';

// Basic usage
const data = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
];

<LineChart data={data} width={600} height={400}>
  <XAxis dataKey="month" />
  <YAxis />
  <Line dataKey="sales" stroke="#8884d8" />
</LineChart>

// With all features
<LineChart
  data={data}
  width={600}
  height={400}
  ariaLabel="Sales data visualization"
  title="Monthly Sales"
>
  <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
  <XAxis dataKey="month" />
  <YAxis tickFormatter={(v) => \`$\${v}\`} />
  <Line dataKey="sales" stroke="#8884d8" dot />
  <Line dataKey="returns" stroke="#82ca9d" />
  <LineChartTooltip />
</LineChart>

// Responsive
<ResponsiveContainer minHeight={400}>
  {(size) => (
    <LineChart
      data={data}
      width={600}
      height={400}
      rwidth={size.rwidth}
      rheight={size.rheight}
    >
      <XAxis dataKey="month" />
      <YAxis />
      <Line dataKey="sales" stroke="#8884d8" />
    </LineChart>
  )}
</ResponsiveContainer>`}
      subComponents={subComponents}
    />
  );
}
