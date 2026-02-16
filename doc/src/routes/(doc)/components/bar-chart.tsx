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
        name: 'tickFormatter',
        type: '(v: string) => string',
        default: '-',
        description: 'Function to format tick labels',
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
    name: 'Bar',
    description:
      'Renders individual bars for a data series. Multiple Bar components create grouped bars by default, or stacked bars when they share a stackId.',
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
        name: 'stackId',
        type: 'string',
        default: '-',
        description:
          'Stack identifier. Bars sharing the same stackId are stacked on top of each other instead of grouped side by side.',
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

export default function BarChartPage() {
  return (
    <DocPage
      title="BarChart"
      description="D3-based bar chart with composable axes, grid, tooltips, and support for grouped and stacked bars."
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
          term: 'Stacked Bars',
          explanation:
            'Bars with the same stackId are rendered on top of each other. The Y-axis auto-scales to the cumulative total.',
        },
        {
          term: 'Bar Gap Control',
          explanation:
            'barGap controls spacing between bars in a group; barCategoryGap controls spacing between groups.',
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
            'Child components (XAxis, YAxis, Bar, CartesianGrid, ChartTooltip)',
        },
      ]}
      playground={`
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

export default function Example() {
  const salesData = [
    { month: 'Jan', revenue: 4000, profit: 2400 },
    { month: 'Feb', revenue: 3000, profit: 1398 },
    { month: 'Mar', revenue: 2000, profit: 9800 },
    { month: 'Apr', revenue: 2780, profit: 3908 },
    { month: 'May', revenue: 1890, profit: 4800 },
    { month: 'Jun', revenue: 2390, profit: 3800 },
  ];

  return (
    <ResponsiveContainer minHeight={300}>
      {(size) => (
        <BarChart
          data={salesData}
          width={600}
          height={300}
          rwidth={size.rwidth}
          rheight={size.rheight}
          ariaLabel="Monthly sales comparison"
        >
          <CartesianGrid strokeDasharray="5 5" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => \`$\${v / 1000}k\`} />
          <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="profit" fill="#82ca9d" radius={[4, 4, 0, 0]} />
          <ChartTooltip />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
`}
      usage={`
        import { BarChart, XAxis, YAxis, Bar, CartesianGrid, ChartTooltip, ResponsiveContainer } from '@kayou/ui';

        // Grouped bars (default)
        <BarChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Bar dataKey="revenue" fill="#8884d8" /><Bar dataKey="profit" fill="#82ca9d" /></BarChart>
        // Stacked bars — same stackId stacks them
        <BarChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Bar dataKey="revenue" fill="#8884d8" stackId="a" /><Bar dataKey="profit" fill="#82ca9d" stackId="a" /><ChartTooltip /></BarChart>
        // Mixed: stacked + grouped
        <BarChart data={data} width={600} height={400}><XAxis dataKey="month" /><YAxis /><Bar dataKey="revenue" fill="#8884d8" stackId="a" /><Bar dataKey="profit" fill="#82ca9d" stackId="a" /><Bar dataKey="expenses" fill="#ffc658" /></BarChart>
      `}
      subComponents={subComponents}
    />
  );
}
