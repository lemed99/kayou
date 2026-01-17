import { Show, createSignal } from 'solid-js';

import { Pie, PieChart, Sector } from '@lib/components/Charts/PieChart';
import { ResponsiveContainer } from '@lib/components/Charts/ResponsiveContainer';
import type { ActiveSector } from '@lib/components/Charts/types';
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

const marketShareData = [
  { name: 'Chrome', value: 65, color: '#4285f4' },
  { name: 'Safari', value: 19, color: '#5ac8fa' },
  { name: 'Firefox', value: 8, color: '#ff7139' },
  { name: 'Edge', value: 5, color: '#0078d4' },
  { name: 'Other', value: 3, color: '#9ca3af' },
];

const salesByRegion = [
  { region: 'North America', sales: 42000 },
  { region: 'Europe', sales: 35000 },
  { region: 'Asia Pacific', sales: 28000 },
  { region: 'Latin America', sales: 12000 },
];

const budgetData = [
  { category: 'Marketing', amount: 25000 },
  { category: 'Development', amount: 45000 },
  { category: 'Operations', amount: 20000 },
  { category: 'Support', amount: 10000 },
];

export default function PieChartPage() {
  const [selectedSegment, setSelectedSegment] = createSignal<Record<
    string,
    unknown
  > | null>(null);

  const renderActiveShape = (props: ActiveSector) => {
    const textColor = '#333';

    return (
      <g>
        <text x={props.cx} y={props.cy} dy={-40} text-anchor="middle" fill={textColor}>
          Total
        </text>
        <text
          x={props.cx}
          y={props.cy}
          dy={-15}
          text-anchor="middle"
          fill={textColor}
          class="text-xl font-bold"
        >
          {props.value}
        </text>

        <Show when={true}>
          <text x={props.cx} y={props.cy} dy={15} text-anchor="middle" fill={textColor}>
            Discounts
          </text>
          <text
            x={props.cx}
            y={props.cy}
            dy={40}
            text-anchor="middle"
            fill={textColor}
            class="text-xl font-bold"
          >
            {0}
          </text>
        </Show>

        <g transform={`translate(${props.cx},${props.cy})`}>
          <Sector
            startAngle={props.startAngle}
            endAngle={props.endAngle}
            innerRadius={props.outerRadius + 9}
            outerRadius={props.outerRadius + 11}
            fill={props.fill}
          />
        </g>

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

        <text x={props.cx + 180} y={props.cy + 20} text-anchor="start" fill={textColor}>
          <tspan class="text-sm">Amount: </tspan>
          <tspan class="font-bold">{props.value}</tspan>
          <title>Amount: {props.value}</title>
        </text>

        <text x={props.cx + 180} y={props.cy + 40} text-anchor="start" fill={textColor}>
          <tspan class="text-sm">Percentage: </tspan>
          <tspan class="font-bold">{`${(props.percent * 100).toFixed(2)}%`}</tspan>
          <title>Percentage: {`${(props.percent * 100).toFixed(2)}%`}</title>
        </text>
      </g>
    );
  };

  return (
    <DocPage
      title="PieChart"
      description="PieChart is a composable charting component built on D3.js for rendering pie and donut charts. It uses a compound component pattern where Pie is nested inside PieChart to share context. The component supports interactive highlighting with custom active shapes, keyboard navigation for accessibility, responsive sizing, and full ARIA support for screen readers."
      keyConcepts={[
        {
          term: 'Donut vs Pie',
          explanation:
            'Set innerRadius to 0 for a traditional pie chart, or a positive value to create a donut chart with a hole in the center. The hole can be used to display summary information.',
        },
        {
          term: 'Active Shape',
          explanation:
            'The activeShape prop accepts a render function that receives the hovered/focused segment data. Use it to create custom highlighting effects like enlarged segments or info displays.',
        },
        {
          term: 'Keyboard Navigation',
          explanation:
            'Pie segments are focusable and support Arrow keys to navigate between segments, Home/End to jump to first/last, and Enter/Space to select. This ensures accessibility for keyboard users.',
        },
        {
          term: 'Percentage Values',
          explanation:
            'The component automatically calculates percentages based on the dataKey values. These are available in the activeShape callback and via aria-labels for screen readers.',
        },
      ]}
      value="Pie charts excel at showing proportional relationships - market share, budget allocation, survey responses. This implementation handles the math and rendering while providing interactivity and accessibility. The D3-powered arc generation ensures precise segments, and the active shape system allows rich hover effects."
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
      examples={[
        {
          title: 'Basic Pie Chart',
          description: 'Simple pie chart showing market share data.',
          code: `<PieChart width={400} height={400}>
  <Pie
    data={marketShareData}
    dataKey="value"
    labelKey="name"
    cx="50%"
    cy="50%"
    innerRadius={0}
    outerRadius={120}
    fill="#8884d8"
  />
</PieChart>`,
          component: () => (
            <div class="flex justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={marketShareData}
                  dataKey="value"
                  labelKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={100}
                  fill="#8884d8"
                />
              </PieChart>
            </div>
          ),
        },
        {
          title: 'Donut Chart',
          description: 'Pie chart with inner radius creating a donut shape.',
          code: `<PieChart width={400} height={400}>
  <Pie
    data={salesByRegion}
    dataKey="sales"
    labelKey="region"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    fill="#82ca9d"
  />
</PieChart>`,
          component: () => (
            <div class="flex justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={salesByRegion}
                  dataKey="sales"
                  labelKey="region"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#82ca9d"
                />
              </PieChart>
            </div>
          ),
        },
        {
          title: 'With Active Shape',
          description: 'Custom highlight effect when hovering or focusing segments.',
          code: `const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent, data } = props;
  return (
    <g>
      <text x={cx} y={cy - 10} text-anchor="middle" fill="#333" font-size="14">
        {data.name}
      </text>
      <text x={cx} y={cy + 10} text-anchor="middle" fill="#666" font-size="12">
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        innerRadius={innerRadius - 5}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

<PieChart width={400} height={400}>
  <Pie
    data={budgetData}
    dataKey="amount"
    labelKey="category"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={100}
    fill="#ffc658"
    activeShape={renderActiveShape}
  />
</PieChart>`,
          component: () => (
            <div class="flex justify-center">
              <PieChart width={300} height={300}>
                <Pie
                  data={budgetData}
                  dataKey="amount"
                  labelKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  fill="#ffc658"
                  activeShape={renderActiveShape}
                />
              </PieChart>
            </div>
          ),
        },
        {
          title: 'With Selection Callback',
          description: 'Handle segment selection via click or keyboard.',
          code: `const [selected, setSelected] = createSignal(null);

<PieChart width={400} height={400}>
  <Pie
    data={marketShareData}
    dataKey="value"
    labelKey="name"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    fill="#a855f7"
    onSegmentSelect={(data, index) => {
      setSelected(data);
      console.log('Selected:', data.name, 'at index', index);
    }}
  />
</PieChart>

{selected() && <p>Selected: {selected().name}</p>}`,
          component: () => (
            <div class="flex flex-col items-center gap-4">
              <PieChart width={300} height={300}>
                <Pie
                  data={marketShareData}
                  dataKey="value"
                  labelKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#a855f7"
                  onSegmentSelect={(data) => setSelectedSegment(data)}
                />
              </PieChart>
              <p class="text-sm text-gray-600">
                {selectedSegment()
                  ? `Selected: ${String(selectedSegment()?.name)}`
                  : 'Click or press Enter on a segment'}
              </p>
            </div>
          ),
        },
        {
          title: 'Responsive Pie Chart',
          description: 'Chart that resizes with its container.',
          code: `<ResponsiveContainer minHeight={400}>
  {(size) => (
    <PieChart
      width={400}
      height={400}
      rwidth={size.rwidth}
      rheight={size.rheight}
    >
      <Pie
        data={salesByRegion}
        dataKey="sales"
        labelKey="region"
        cx="50%"
        cy="50%"
        innerRadius={40}
        outerRadius={Math.min(size.rwidth, size.rheight) / 3}
        fill="#8884d8"
      />
    </PieChart>
  )}
</ResponsiveContainer>`,
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={300}>
                {(size) => (
                  <PieChart
                    width={300}
                    height={300}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <Pie
                      data={salesByRegion}
                      dataKey="sales"
                      labelKey="region"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={Math.min(size.rwidth, size.rheight) / 3}
                      fill="#8884d8"
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'Accessible Pie Chart',
          description: 'Chart with full accessibility attributes.',
          code: `<PieChart
  width={400}
  height={400}
  ariaLabel="Browser market share distribution"
  title="Browser Market Share 2024"
  description="Chrome leads with 65%, followed by Safari at 19%"
>
  <Pie
    data={marketShareData}
    dataKey="value"
    labelKey="name"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    fill="#4285f4"
  />
</PieChart>`,
          component: () => (
            <div class="flex justify-center">
              <PieChart
                width={300}
                height={300}
                ariaLabel="Browser market share distribution"
                title="Browser Market Share 2024"
                description="Chrome leads with 65%, followed by Safari at 19%"
              >
                <Pie
                  data={marketShareData}
                  dataKey="value"
                  labelKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={100}
                  fill="#4285f4"
                />
              </PieChart>
            </div>
          ),
        },
      ]}
      usage={`import { PieChart, Pie, Sector } from '@exowpee/the_rock/Charts/PieChart';
import { ResponsiveContainer } from '@exowpee/the_rock/Charts/ResponsiveContainer';

// Basic pie chart
const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 200 },
];

<PieChart width={400} height={400}>
  <Pie
    data={data}
    dataKey="value"
    labelKey="name"
    cx="50%"
    cy="50%"
    innerRadius={0}
    outerRadius={120}
    fill="#8884d8"
  />
</PieChart>

// Donut chart with active shape
const renderActiveShape = (props) => (
  <g>
    <text x={props.cx} y={props.cy} text-anchor="middle">
      {props.data.name}: {(props.percent * 100).toFixed(0)}%
    </text>
    <Sector
      innerRadius={props.innerRadius - 5}
      outerRadius={props.outerRadius + 10}
      startAngle={props.startAngle}
      endAngle={props.endAngle}
      fill={props.fill}
    />
  </g>
);

<PieChart width={400} height={400}>
  <Pie
    data={data}
    dataKey="value"
    labelKey="name"
    cx="50%"
    cy="50%"
    innerRadius={60}
    outerRadius={120}
    fill="#82ca9d"
    activeShape={renderActiveShape}
    onSegmentSelect={(data, index) => console.log(data, index)}
  />
</PieChart>

// Responsive
<ResponsiveContainer minHeight={400}>
  {(size) => (
    <PieChart
      width={400}
      height={400}
      rwidth={size.rwidth}
      rheight={size.rheight}
    >
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={100}
        fill="#ffc658"
      />
    </PieChart>
  )}
</ResponsiveContainer>`}
      subComponents={subComponents}
    />
  );
}
