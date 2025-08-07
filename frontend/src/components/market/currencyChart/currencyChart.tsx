import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import './currencyChart.css';

interface CurrencyChartProps {
  data: number[];
  color?: string;
}

export const CurrencyChart = ({
  data,
  color = '#10b981',
}: CurrencyChartProps) => {
  const chartData = data.map((price, index) => ({ index, price }));

  const prices = data;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const paddingFactor = 0.02;
  const domainMin = minPrice * (1 - paddingFactor);
  const domainMax = maxPrice * (1 + paddingFactor);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis
            domain={[domainMin, domainMax]}
            hide={true}
            type="number"
            allowDataOverflow={true}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
