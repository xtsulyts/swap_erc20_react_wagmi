import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useEthPrice, useEthChart, useUsdcChart } from '../../hooks/useCoinGecko';
import { usePoolInfo } from '../../hooks/usePoolInfo';

type Range = 7 | 14 | 30;
type ActiveChart = 'eth' | 'usdc' | 'pool';

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' });
}

const RANGES: Range[] = [7, 14, 30];

const ChartSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-2 h-48 justify-end px-2">
    {[40, 60, 80, 55, 70, 90, 65].map((h, i) => (
      <div key={i} className="bg-gray-700 rounded" style={{ height: `${h}%`, width: '100%' }} />
    ))}
  </div>
);

const PriceChart: React.FC = () => {
  const [range, setRange] = useState<Range>(30);
  const [active, setActive] = useState<ActiveChart>('eth');

  const { data: ethPrice, isLoading: loadingPrice } = useEthPrice();
  const { data: ethChart, isLoading: loadingEth } = useEthChart(range);
  const { data: usdcChart, isLoading: loadingUsdc } = useUsdcChart(range);
  const { reserveA, reserveB, exchangeRate } = usePoolInfo();

  const poolChartData = React.useMemo(() => {
    if (!ethChart) return [];
    return ethChart.map((point) => ({
      timestamp: point.timestamp,
      price: point.price,
    }));
  }, [ethChart]);

  const chartData =
    active === 'eth' ? ethChart :
    active === 'usdc' ? usdcChart :
    poolChartData;

  const isLoading =
    active === 'eth' ? loadingEth :
    active === 'usdc' ? loadingUsdc :
    loadingEth;

  const priceChange = ethPrice?.usd_24h_change ?? 0;
  const isPositive = priceChange >= 0;

  const chartColor =
    active === 'pool' ? '#a78bfa' :
    isPositive ? '#34d399' : '#f87171';

  const tabs: { key: ActiveChart; label: string }[] = [
    { key: 'eth', label: 'ETH/USD' },
    { key: 'usdc', label: 'USDC/USD' },
    { key: 'pool', label: 'Pool TKA/TKB' },
  ];

  const poolRatio = exchangeRate !== '—' ? exchangeRate : null;

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Mercado
          </h3>
          {active !== 'pool' && (
            <div className="mt-1">
              {loadingPrice ? (
                <div className="animate-pulse bg-gray-600 rounded h-7 w-32" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">
                    ${active === 'eth' ? ethPrice?.usd.toLocaleString('es-AR') : '~1.00'}
                  </span>
                  {active === 'eth' && (
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
          {active === 'pool' && (
            <div className="mt-1">
              <span className="text-2xl font-bold">
                {poolRatio ? `1 TKA = ${poolRatio} TKB` : '—'}
              </span>
            </div>
          )}
        </div>

        {/* Range selector */}
        {active !== 'pool' && (
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  range === r
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {r}d
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 mb-4 bg-gray-900 rounded-lg p-1">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`flex-1 text-xs py-1.5 rounded-md transition-colors font-medium ${
              active === key
                ? 'bg-gray-700 text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48">
        {isLoading ? (
          <ChartSkeleton />
        ) : active === 'pool' ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Ratio actual del pool</p>
              <p className="text-2xl font-bold text-purple-400">
                {poolRatio ? `1 TKA = ${poolRatio} TKB` : '—'}
              </p>
            </div>
            <div className="w-full grid grid-cols-2 gap-3 mt-2">
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Reserva TKA</p>
                <p className="font-mono text-sm text-blue-300">
                  {reserveA !== undefined
                    ? (Number(reserveA) / 1e18).toFixed(4)
                    : '—'}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Reserva TKB</p>
                <p className="font-mono text-sm text-purple-300">
                  {reserveB !== undefined
                    ? (Number(reserveB) / 1e18).toFixed(4)
                    : '—'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatDate}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={55}
                tickFormatter={(v) =>
                  active === 'eth'
                    ? `$${v.toLocaleString('es-AR')}`
                    : `$${v.toFixed(4)}`
                }
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                labelFormatter={(v) => formatDate(Number(v))}
                formatter={(value) => [
                  typeof value === 'number'
                    ? active === 'eth'
                      ? `$${value.toLocaleString('es-AR')}`
                      : `$${value.toFixed(4)}`
                    : String(value),
                  active === 'eth' ? 'ETH' : 'USDC',
                ]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartColor}
                strokeWidth={2}
                fill="url(#colorPrice)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {active !== 'pool' && (
        <p className="text-xs text-gray-600 mt-2 text-right">Fuente: CoinGecko</p>
      )}
    </div>
  );
};

export default PriceChart;
