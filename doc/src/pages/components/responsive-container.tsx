import {
  CartesianGrid,
  Line,
  LineChart,
  LineChartTooltip,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from '@exowpee/solidly';

import DocPage from '../../components/DocPage';

const salesData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

const pieData = [
  { name: 'Desktop', value: 55 },
  { name: 'Mobile', value: 35 },
  { name: 'Tablet', value: 10 },
];

export default function ResponsiveContainerPage() {
  return (
    <DocPage
      title="ResponsiveContainer"
      description="Wrapper that tracks container dimensions and passes them to child charts via render props."
      keyConcepts={[
        {
          term: 'Render Props',
          explanation:
            'Children receive { rwidth, rheight } to pass to chart components.',
        },
        {
          term: 'ResizeObserver',
          explanation: 'Efficiently detects container size changes via browser API.',
        },
        {
          term: 'Minimum Height',
          explanation: 'minHeight prevents layout shifts before content renders.',
        },
        {
          term: 'rwidth/rheight Props',
          explanation:
            'Charts accept these props to override base dimensions responsively.',
        },
      ]}
      props={[
        {
          name: 'minHeight',
          type: 'number',
          default: '200',
          description: 'Minimum height of the container in pixels',
        },
        {
          name: 'children',
          type: 'JSX.Element | ((size: Size) => JSX.Element)',
          default: '-',
          description:
            'Static JSX element or render function receiving { rwidth, rheight }',
          required: true,
        },
      ]}
      examples={[
        {
          title: 'Basic Responsive LineChart',
          description: 'LineChart that fills its container width.',
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
          title: 'Responsive PieChart',
          description: 'PieChart with dynamic outer radius based on container size.',
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={250}>
                {(size) => {
                  const radius = Math.min(size.rwidth, size.rheight) / 3;
                  return (
                    <PieChart
                      width={300}
                      height={300}
                      rwidth={size.rwidth}
                      rheight={size.rheight}
                    >
                      <Pie
                        data={pieData}
                        dataKey="value"
                        labelKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={radius * 0.5}
                        outerRadius={radius}
                        fill="#82ca9d"
                      />
                    </PieChart>
                  );
                }}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'Fixed Aspect Ratio',
          description: 'Maintain a 16:9 aspect ratio using calculated height.',
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={200}>
                {(size) => {
                  const aspectHeight = Math.max(200, size.rwidth * (9 / 16));
                  return (
                    <LineChart
                      data={salesData}
                      width={600}
                      height={337}
                      rwidth={size.rwidth}
                      rheight={aspectHeight}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Line dataKey="revenue" stroke="#8884d8" />
                    </LineChart>
                  );
                }}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'Side by Side Charts',
          description: 'Multiple responsive charts in a grid layout.',
          component: () => (
            <div class="grid w-full grid-cols-2 gap-4">
              <ResponsiveContainer minHeight={200}>
                {(size) => (
                  <LineChart
                    data={salesData}
                    width={300}
                    height={200}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line dataKey="revenue" stroke="#8884d8" />
                  </LineChart>
                )}
              </ResponsiveContainer>

              <ResponsiveContainer minHeight={200}>
                {(size) => (
                  <PieChart
                    width={200}
                    height={200}
                    rwidth={size.rwidth}
                    rheight={size.rheight}
                  >
                    <Pie
                      data={pieData}
                      dataKey="value"
                      labelKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={Math.min(size.rwidth, size.rheight) / 3}
                      fill="#82ca9d"
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          ),
        },
        {
          title: 'With Static Children',
          description:
            'ResponsiveContainer can also wrap static content (no render prop).',
          component: () => (
            <div class="w-full">
              <ResponsiveContainer minHeight={100}>
                <div class="flex h-full items-center justify-center rounded bg-blue-100 p-4 dark:bg-blue-900">
                  <p class="text-blue-800 dark:text-blue-200">
                    This content fills the container
                  </p>
                </div>
              </ResponsiveContainer>
            </div>
          ),
        },
      ]}
      usage={`
        import { ResponsiveContainer } from '@exowpee/solidlyCharts/ResponsiveContainer';
        import { LineChart, XAxis, YAxis, Line } from '@exowpee/solidlyCharts/LineCharts';
        import { PieChart, Pie } from '@exowpee/solidlyCharts/PieChart';

        // Basic responsive chart
        <ResponsiveContainer minHeight={300}>
          {(size) => (
            <LineChart
              data={data}
              width={600}
              height={300}
              rwidth={size.rwidth}
              rheight={size.rheight}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Line dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          )}
        </ResponsiveContainer>

        // Dynamic radius for pie chart
        <ResponsiveContainer minHeight={400}>
          {(size) => {
            const radius = Math.min(size.rwidth, size.rheight) / 3;
            return (
              <PieChart width={400} height={400} rwidth={size.rwidth} rheight={size.rheight}>
                <Pie
                  data={data}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={radius}
                  fill="#82ca9d"
                />
              </PieChart>
            );
          }}
        </ResponsiveContainer>

        // Maintain aspect ratio
        <ResponsiveContainer minHeight={200}>
          {(size) => {
            const aspectHeight = size.rwidth * (9 / 16); // 16:9 ratio
            return (
              <LineChart
                data={data}
                width={600}
                height={337}
                rwidth={size.rwidth}
                rheight={aspectHeight}
              >
                {/* ... */}
              </LineChart>
            );
          }}
        </ResponsiveContainer>

        // Static content (no render prop)
        <ResponsiveContainer minHeight={100}>
          <div>Content that fills the container</div>
        </ResponsiveContainer>
      `}
    />
  );
}
