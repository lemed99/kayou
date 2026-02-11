import DocPage from '../../../components/DocPage';

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
      playground={`
import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, CartesianGrid, ChartTooltip } from '@kayou/ui';

export default function Example() {
  const salesData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
  ];

  return (
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
          <ChartTooltip />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
}
`}
      usage={`
        import { ResponsiveContainer, LineChart, XAxis, YAxis, Line, PieChart, Pie } from '@kayou/ui';

        <ResponsiveContainer minHeight={300}>{(size) => <LineChart data={data} width={600} height={300} rwidth={size.rwidth} rheight={size.rheight}><XAxis dataKey="month" /><YAxis /><Line dataKey="revenue" stroke="#8884d8" /></LineChart>}</ResponsiveContainer>
        <ResponsiveContainer minHeight={100}><div>Static content</div></ResponsiveContainer>
      `}
    />
  );
}
