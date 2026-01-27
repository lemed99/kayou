import {
  Bar,
  CartesianGrid,
  BarChart,
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
        type: '(v: string) => string',
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
    name: 'Bar',
    description:
      'Renders individual bars for a data series. Multiple Bar components can be added for grouped bar charts.',
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
        description: 'Fill color of the bars',
      },
      {
        name: 'radius',
        type: 'number | [number, number, number, number]',
        default: '0',
        description:
          'Border radius for bars. Single number for top corners, or array [topLeft, topRight, bottomRight, bottomLeft]',
      },
      {
        name: 'shape',
        type: '(props: BarShapeProps) => JSX.Element',
        default: '-',
        description: 'Custom render function for bar shapes',
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
      'Adds an interactive tooltip that appears when hovering over bars. Shows the data value and category.',
    props: [
      {
        name: 'content',
        type: '(data: Record<string, unknown>, barKey: string) => JSX.Element',
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
];

const quarterlyData = [
  { quarter: 'Q1', sales: 12000, returns: 800 },
  { quarter: 'Q2', sales: 15000, returns: 1200 },
  { quarter: 'Q3', sales: 18000, returns: 900 },
  { quarter: 'Q4', sales: 22000, returns: 1100 },
];

const categoryData = [
  { category: 'Electronics', value: 4500 },
  { category: 'Clothing', value: 3200 },
  { category: 'Food', value: 2800 },
  { category: 'Books', value: 1500 },
  { category: 'Sports', value: 2100 },
];

export default function BarChartPage() {
  return (
    <DocPage
      title="BarChart"
      description="D3-based bar chart with composable axes, grid, tooltips, and support for grouped bars."
      dependencies={[
        {
          name: 'd3-scale',
          url: 'https://github.com/d3/d3-scale',
          usage: 'Provides scaleBand for category axis and scaleLinear for value axis',
        },
      ]}
      keyConcepts={[
        {
          term: 'Compound Components',
          explanation:
            'Composable children (XAxis, YAxis, Bar) share state via context.',
        },
        {
          term: 'D3 Scales',
          explanation:
            'Uses scaleBand for categorical x-axis and scaleLinear for numeric y-axis.',
        },
        {
          term: 'Grouped Bars',
          explanation:
            'Multiple Bar components create grouped bars with automatic positioning.',
        },
        {
          term: 'Bar Gap Control',
          explanation:
            'barGap controls spacing between bars in a group; barCategoryGap controls spacing between groups.',
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
          name: 'barGap',
          type: 'number',
          default: '0.1',
          description: 'Gap between bars within a group (0-1 ratio of bar width)',
        },
        {
          name: 'barCategoryGap',
          type: 'number',
          default: '0.2',
          description: 'Gap between bar groups (0-1 ratio of category width)',
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
          default: '"Bar chart"',
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
            'Child components (XAxis, YAxis, Bar, CartesianGrid, ChartTooltip)',
        },
      ]}
      examples={[
        {
          title: 'Basic Bar Chart',
          description: 'Simple bar chart with a single data series.',
          component: () => (
            <div class="h-64 w-full">
              <BarChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </div>
          ),
        },
        {
          title: 'Grouped Bars',
          description: 'Chart with multiple data series displayed as grouped bars.',
          component: () => (
            <div class="h-64 w-full">
              <BarChart data={salesData} width={500} height={250}>
                <CartesianGrid stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="profit" fill="#82ca9d" />
                <ChartTooltip />
              </BarChart>
            </div>
          ),
        },
        {
          title: 'Rounded Bars',
          description: 'Bars with rounded top corners for a modern look.',
          component: () => (
            <div class="h-64 w-full">
              <BarChart data={categoryData} width={500} height={250}>
                <CartesianGrid strokeDasharray="5 5" />
                <XAxis dataKey="category" />
                <YAxis />
                <Bar dataKey="value" fill="#10b981" radius={4} />
                <ChartTooltip />
              </BarChart>
            </div>
          ),
        },
        {
          title: 'Custom Tick Formatters',
          description: 'Format axis labels with custom functions.',
          component: () => (
            <div class="h-64 w-full">
              <BarChart data={quarterlyData} width={500} height={250}>
                <CartesianGrid stroke="#ddd" />
                <XAxis dataKey="quarter" />
                <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <ChartTooltip />
              </BarChart>
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
                  <BarChart
                    data={salesData}
                    width={600}
                    height={250}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="revenue" fill="#8884d8" />
                    <ChartTooltip />
                  </BarChart>
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
              <BarChart data={salesData} width={500} height={250}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="revenue" fill="#8884d8" />
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
              </BarChart>
            </div>
          ),
        },
        {
          title: 'Accessible Chart',
          description: 'Chart with accessibility attributes for screen readers.',
          component: () => (
            <div class="h-64 w-full">
              <BarChart
                data={salesData}
                width={500}
                height={250}
                ariaLabel="Monthly sales comparison for 2024"
                title="Sales Chart"
                description="Shows monthly revenue and profit from January to June 2024"
              >
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </div>
          ),
        },
      ]}
      usage={`
        import { BarChart, XAxis, YAxis, Bar, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

        <BarChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Bar dataKey="sales" fill="#8884d8" /></BarChart>
        <BarChart data={data} width={600} height={400}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Bar dataKey="sales" fill="#8884d8" radius={4} /><ChartTooltip /></BarChart>
      `}
      subComponents={subComponents}
    />
  );
}
