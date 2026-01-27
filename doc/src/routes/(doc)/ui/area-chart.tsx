import {
  Area,
  CartesianGrid,
  AreaChart,
  ChartTooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from '@kayou/ui';
import DocPage from '../../../components/DocPage';

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
    name: 'Area',
    description:
      'Renders a data series as a filled area. Multiple Area components can be added for comparing series.',
    props: [
      {
        name: 'dataKey',
        type: 'string',
        default: '-',
        description: 'Key in data objects containing the numeric values (required)',
        required: true,
      },
      {
        name: 'fill',
        type: 'string',
        default: '"#8884d8"',
        description: 'Fill color for the area',
      },
      {
        name: 'fillOpacity',
        type: 'number',
        default: '0.6',
        description: 'Opacity of the fill (0-1)',
      },
      {
        name: 'stroke',
        type: 'string',
        default: 'Same as fill',
        description: 'Color of the line on top of the area',
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
      {
        name: 'type',
        type: '"monotone" | "linear" | "step"',
        default: '"monotone"',
        description: 'Type of curve interpolation',
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
    name: 'ChartTooltip',
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

const trafficData = [
  { hour: '00:00', visitors: 120 },
  { hour: '04:00', visitors: 80 },
  { hour: '08:00', visitors: 450 },
  { hour: '12:00', visitors: 890 },
  { hour: '16:00', visitors: 760 },
  { hour: '20:00', visitors: 540 },
  { hour: '23:00', visitors: 230 },
];

export default function AreaChartPage() {
  return (
    <DocPage
      title="AreaChart"
      description="D3-based area chart with composable axes, grid, tooltips, and multiple data series with filled areas."
      dependencies={[
        {
          name: 'd3-scale',
          url: 'https://github.com/d3/d3-scale',
          usage: 'Provides scaleLinear and scalePoint for axis scaling',
        },
        {
          name: 'd3-shape',
          url: 'https://github.com/d3/d3-shape',
          usage: 'Provides area generator for rendering filled paths',
        },
        {
          name: 'd3-selection',
          url: 'https://github.com/d3/d3-selection',
          usage: 'Provides pointer utility for mouse position tracking',
        },
      ]}
      keyConcepts={[
        {
          term: 'Compound Components',
          explanation:
            'Composable children (XAxis, YAxis, Area) share state via context.',
        },
        {
          term: 'Filled Areas',
          explanation:
            'Areas are filled from the data line down to the baseline with opacity.',
        },
        {
          term: 'Curve Types',
          explanation:
            'Supports monotone (smooth), linear (straight), and step interpolation.',
        },
        {
          term: 'Multiple Series',
          explanation: 'Add multiple Area components with different dataKey props.',
        },
      ]}
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
          default: '"Area chart"',
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
            'Child components (XAxis, YAxis, Area, CartesianGrid, ChartTooltip)',
        },
      ]}
      examples={[
        {
          title: 'Basic Area Chart',
          description: 'Simple area chart with a single data series.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Area dataKey="revenue" fill="#8884d8" />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'Multiple Areas',
          description: 'Chart with multiple data series for comparison.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={salesData} width={500} height={250}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area dataKey="revenue" fill="#8884d8" fillOpacity={0.5} />
                <Area dataKey="profit" fill="#82ca9d" fillOpacity={0.5} />
                <ChartTooltip />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'With Dots',
          description: 'Show data points on the area.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={temperatureData} width={500} height={250}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="day" />
                <YAxis />
                <Area dataKey="high" fill="#ef4444" fillOpacity={0.4} dot />
                <Area dataKey="low" fill="#3b82f6" fillOpacity={0.4} dot />
                <ChartTooltip />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'Step Interpolation',
          description: 'Use step curve for discrete data changes.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={trafficData} width={500} height={250}>
                <CartesianGrid stroke="#ddd" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Area dataKey="visitors" fill="#10b981" type="step" />
                <ChartTooltip />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'Custom Tick Formatters',
          description: 'Format axis labels with custom functions.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={trafficData} width={500} height={250}>
                <CartesianGrid stroke="#ddd" />
                <XAxis dataKey="hour" />
                <YAxis tickFormatter={(v) => `${v}`} />
                <Area
                  dataKey="visitors"
                  fill="#6366f1"
                  fillOpacity={0.7}
                  strokeWidth={2}
                />
                <ChartTooltip />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'Responsive Chart',
          description: 'Chart that resizes with its container using ResponsiveContainer.',
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={250}>
                {(size) => (
                  <AreaChart
                    data={salesData}
                    width={600}
                    height={250}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Area dataKey="revenue" fill="#8884d8" />
                    <ChartTooltip />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'Custom Tooltip',
          description: 'Provide a custom tooltip renderer.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Area dataKey="revenue" fill="#8884d8" />
                <ChartTooltip
                  content={(data) => (
                    <div class="rounded border bg-white p-3 shadow-lg">
                      <div class="font-bold">{String(data.month)}</div>
                      <div class="text-purple-600">
                        Revenue: ${Number(data.revenue).toLocaleString()}
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </div>
          ),
        },
        {
          title: 'Accessible Chart',
          description: 'Chart with accessibility attributes for screen readers.',
          component: () => (
            <div class="h-64 w-full">
              <AreaChart
                data={salesData}
                width={500}
                height={250}
                ariaLabel="Monthly revenue trend for 2024"
                title="Revenue Chart"
                description="Shows monthly revenue from January to July 2024"
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Area dataKey="revenue" fill="#8884d8" />
              </AreaChart>
            </div>
          ),
        },
      ]}
      usage={`
        import { AreaChart, XAxis, YAxis, Area, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

        <AreaChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Area dataKey="sales" fill="#8884d8" /></AreaChart>
        <AreaChart data={data} width={600} height={400}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Area dataKey="sales" fill="#8884d8" fillOpacity={0.6} dot /><ChartTooltip /></AreaChart>
      `}
      subComponents={subComponents}
    />
  );
}
