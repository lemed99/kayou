import DocPage from '../../../components/DocPage';

const subComponents = [
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
        description: 'Suggested number of ticks to display on the axis',
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
        default: '"currentColor"',
        description: 'Color of the axis line and tick marks',
      },
      {
        name: 'angle',
        type: 'number',
        default: '0',
        description: 'Angle (in degrees) to rotate tick labels',
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
        default: '"currentColor"',
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
        default: '"currentColor"',
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
        default: '"currentColor"',
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
        {
          term: 'Responsive Container',
          explanation:
            'Wrap in ResponsiveContainer for auto-resizing. It passes rwidth/rheight to the chart via a render function.',
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
          name: 'axisClass',
          type: 'string',
          default: '"text-neutral-500 dark:text-neutral-500"',
          description: 'CSS class applied to axis elements (XAxis, YAxis)',
        },
        {
          name: 'gridClass',
          type: 'string',
          default: '"text-neutral-300 dark:text-neutral-800"',
          description: 'CSS class applied to the CartesianGrid element',
        },
        {
          name: 'children',
          type: 'JSX.Element',
          default: '-',
          description:
            'Child components (XAxis, YAxis, Area, CartesianGrid, ChartTooltip)',
        },
      ]}
      playground={`
import { AreaChart, XAxis, YAxis, Area, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

export default function Example() {
  const salesData = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 2000, profit: 9800 },
    { month: 'Apr', revenue: 2780, profit: 3908 },
    { month: 'May', revenue: 1890, profit: 4800 },
    { month: 'Jun', revenue: 2390, profit: 3800 },
    { month: 'Jul', revenue: 3490, profit: 4300 },
  ];

  return (
    <ResponsiveContainer minHeight={300}>
      {(size) => (
        <AreaChart
          data={salesData}
          width={600}
          height={300}
          rwidth={size.rwidth}
          rheight={size.rheight}
          ariaLabel="Monthly revenue and profit trend"
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => \`$\${v / 1000}k\`} />
          <Area dataKey="revenue" fill="#8884d8" fillOpacity={0.5} dot />
          <Area dataKey="profit" fill="#82ca9d" fillOpacity={0.5} dot />
          <ChartTooltip />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
`}
      usage={`
        import { AreaChart, XAxis, YAxis, Area, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

        <AreaChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Area dataKey="sales" fill="#8884d8" /></AreaChart>
        <AreaChart data={data} width={600} height={400}><CartesianGrid /><XAxis dataKey="month" /><YAxis /><Area dataKey="sales" fill="#8884d8" fillOpacity={0.6} dot /><ChartTooltip /></AreaChart>
      `}
      subComponents={subComponents}
    />
  );
}
