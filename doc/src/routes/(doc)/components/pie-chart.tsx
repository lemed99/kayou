import DocPage from '../../../components/DocPage';

const subComponents = [
  {
    name: 'Pie',
    description:
      'Renders the pie/donut segments inside a PieChart. Supports keyboard navigation, hover states, and custom active shapes for highlighting.',
    props: [
      {
        name: 'data',
        type: 'Record<string, unknown>[]',
        default: '-',
        description: 'Array of data objects to display (required)',
        required: true,
      },
      {
        name: 'dataKey',
        type: 'string',
        default: '-',
        description: 'Key in data objects containing the numeric value (required)',
        required: true,
      },
      {
        name: 'labelKey',
        type: 'string',
        default: '-',
        description:
          'Key in data objects containing the label/name (used for accessibility)',
      },
      {
        name: 'cx',
        type: 'number | string',
        default: '-',
        description:
          'X coordinate of the center (number or percentage like "50%") (required)',
        required: true,
      },
      {
        name: 'cy',
        type: 'number | string',
        default: '-',
        description:
          'Y coordinate of the center (number or percentage like "50%") (required)',
        required: true,
      },
      {
        name: 'innerRadius',
        type: 'number',
        default: '-',
        description: 'Inner radius for donut charts (0 for pie) (required)',
        required: true,
      },
      {
        name: 'outerRadius',
        type: 'number',
        default: '-',
        description: 'Outer radius of the chart (required)',
        required: true,
      },
      {
        name: 'fill',
        type: 'string',
        default: '-',
        description: 'Fill color for segments (required)',
        required: true,
      },
      {
        name: 'activeShape',
        type: '(props: ActiveSector) => JSX.Element',
        default: '-',
        description: 'Custom render function for the active/highlighted segment',
      },
      {
        name: 'onSegmentSelect',
        type: '(data: Record<string, unknown>, index: number) => void',
        default: '-',
        description: 'Callback when a segment is selected via click or keyboard',
      },
    ],
  },
  {
    name: 'Sector',
    description:
      'Renders a single arc/sector shape using D3. Used internally by Pie and can be used in activeShape render functions for custom highlighting.',
    props: [
      {
        name: 'innerRadius',
        type: 'number',
        default: '-',
        description: 'Inner radius of the sector (required)',
        required: true,
      },
      {
        name: 'outerRadius',
        type: 'number',
        default: '-',
        description: 'Outer radius of the sector (required)',
        required: true,
      },
      {
        name: 'startAngle',
        type: 'number',
        default: '-',
        description: 'Start angle in radians (required)',
        required: true,
      },
      {
        name: 'endAngle',
        type: 'number',
        default: '-',
        description: 'End angle in radians (required)',
        required: true,
      },
      {
        name: 'fill',
        type: 'string',
        default: '-',
        description: 'Fill color of the sector (required)',
        required: true,
      },
    ],
  },
  {
    name: 'ActiveSector (Type)',
    description:
      'The props object passed to the activeShape render function. Contains all sector geometry plus computed values.',
    props: [
      {
        name: 'cx',
        type: 'number',
        default: '-',
        description: 'Computed X coordinate of the pie center',
      },
      {
        name: 'cy',
        type: 'number',
        default: '-',
        description: 'Computed Y coordinate of the pie center',
      },
      {
        name: 'innerRadius',
        type: 'number',
        default: '-',
        description: 'Inner radius of the segment',
      },
      {
        name: 'outerRadius',
        type: 'number',
        default: '-',
        description: 'Outer radius of the segment',
      },
      {
        name: 'startAngle',
        type: 'number',
        default: '-',
        description: 'Start angle of the segment in radians',
      },
      {
        name: 'endAngle',
        type: 'number',
        default: '-',
        description: 'End angle of the segment in radians',
      },
      {
        name: 'fill',
        type: 'string',
        default: '-',
        description: 'Fill color of the segment',
      },
      {
        name: 'value',
        type: 'number',
        default: '-',
        description: 'The numeric value of this segment',
      },
      {
        name: 'percent',
        type: 'number',
        default: '-',
        description: 'Percentage this segment represents (0-1)',
      },
      {
        name: 'data',
        type: 'Record<string, unknown>',
        default: '-',
        description: 'The original data object for this segment',
      },
    ],
  },
];

export default function PieChartPage() {
  return (
    <DocPage
      title="PieChart"
      description="D3-based pie/donut chart with interactive segments and custom active shape highlighting."
      dependencies={[
        {
          name: 'd3-shape',
          url: 'https://github.com/d3/d3-shape',
          usage: 'Provides arc function for rendering pie chart sectors',
        },
      ]}
      keyConcepts={[
        {
          term: 'Donut vs Pie',
          explanation:
            'innerRadius=0 for pie; positive value creates donut with center hole.',
        },
        {
          term: 'Active Shape',
          explanation: 'Render function for custom hover/focus effects on segments.',
        },
        {
          term: 'Keyboard Navigation',
          explanation: 'Arrow keys navigate segments; Enter/Space to select.',
        },
        {
          term: 'Percentage Values',
          explanation:
            'Auto-calculated percentages available in activeShape and aria-labels.',
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
          default: '"Pie chart"',
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
          description: 'Child Pie component(s)',
        },
      ]}
      playground={`
import { PieChart, Pie, Sector, ResponsiveContainer } from '@kayou/ui';
import { createSignal } from 'solid-js';

export default function Example() {
  const [selectedSegment, setSelectedSegment] = createSignal(null);

  const marketShareData = [
    { name: 'Chrome', value: 65, color: '#4285f4' },
    { name: 'Safari', value: 19, color: '#5ac8fa' },
    { name: 'Firefox', value: 8, color: '#ff7139' },
    { name: 'Edge', value: 5, color: '#0078d4' },
    { name: 'Other', value: 3, color: '#9ca3af' },
  ];

  const renderActiveShape = (props) => (
    <g>
      <text x={props.cx} y={props.cy} dy={-10} text-anchor="middle" fill="#333" class="text-xl font-bold">
        {props.value}
      </text>
      <text x={props.cx} y={props.cy} dy={15} text-anchor="middle" fill="#666" class="text-sm">
        {(props.percent * 100).toFixed(1)}%
      </text>
      <g transform={\`translate(\${props.cx},\${props.cy})\`}>
        <Sector
          startAngle={props.startAngle}
          endAngle={props.endAngle}
          innerRadius={props.outerRadius + 6}
          outerRadius={props.outerRadius + 10}
          fill={props.fill}
        />
      </g>
    </g>
  );

  return (
    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        {selectedSegment()
          ? \`Selected: \${String(selectedSegment()?.name)} (\${selectedSegment()?.value}%)\`
          : 'Click or press Enter on a segment to select it. Use arrow keys to navigate.'}
      </p>

      {/* Responsive donut chart with active shape and selection */}
      <ResponsiveContainer minHeight={300}>
        {(size) => (
          <PieChart
            width={400}
            height={300}
            rwidth={size.rwidth}
            rheight={size.rheight}
            ariaLabel="Browser market share distribution"
            title="Browser Market Share"
            description="Chrome leads with 65%, followed by Safari at 19%"
          >
            <Pie
              data={marketShareData}
              dataKey="value"
              labelKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={Math.min(size.rwidth, size.rheight) / 3}
              fill="#8884d8"
              activeShape={renderActiveShape}
              onSegmentSelect={(data) => setSelectedSegment(data)}
            />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
`}
      usage={`
        import { PieChart, Pie, Sector, ResponsiveContainer } from '@kayou/ui';

        <PieChart width={400} height={400}><Pie data={data} dataKey="value" labelKey="name" cx="50%" cy="50%" innerRadius={0} outerRadius={120} fill="#8884d8" /></PieChart>
        <PieChart width={400} height={400}><Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={120} fill="#82ca9d" activeShape={renderActiveShape} /></PieChart>
      `}
      subComponents={subComponents}
    />
  );
}
