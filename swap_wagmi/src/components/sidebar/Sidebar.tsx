import React from 'react';
import { useMarketPrices } from '../../hooks/useCoinGecko';
import { usePoolInfo } from '../../hooks/usePoolInfo';
import { formatBalance } from '../../utils/format';

const COIN_ICONS: Record<string, string> = {
  ETH:   new URL('cryptocurrency-icons/svg/color/eth.svg',   import.meta.url).href,
  BTC:   new URL('cryptocurrency-icons/svg/color/btc.svg',   import.meta.url).href,
  SOL:   new URL('cryptocurrency-icons/svg/color/sol.svg',   import.meta.url).href,
  BNB:   new URL('cryptocurrency-icons/svg/color/bnb.svg',   import.meta.url).href,
  MATIC: new URL('cryptocurrency-icons/svg/color/matic.svg', import.meta.url).href,
};

const Sidebar: React.FC = () => {
  const { data: coins, isLoading: loadingCoins } = useMarketPrices();
  const { reserveA, reserveB, exchangeRate, loading: loadingPool } = usePoolInfo();

  return (
    <aside className="flex flex-col gap-4">
      {/* Market Prices */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Mercado
        </h3>
        <div className="flex flex-col gap-3">
          {loadingCoins
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gray-700 animate-pulse" />
                    <div className="w-10 h-4 bg-gray-700 rounded animate-pulse" />
                  </div>
                  <div className="text-right">
                    <div className="w-16 h-4 bg-gray-700 rounded animate-pulse mb-1" />
                    <div className="w-10 h-3 bg-gray-700 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : coins?.map((coin) => {
                const isPos = coin.usd_24h_change >= 0;
                return (
                  <div key={coin.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={COIN_ICONS[coin.symbol]} alt={coin.symbol} className="w-7 h-7 rounded-full" />
                      <div>
                        <p className="text-sm font-medium leading-none">{coin.symbol}</p>
                        <p className="text-xs text-gray-500">{coin.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {coin.usd != null ? `$${coin.usd.toLocaleString('es-AR')}` : '—'}
                      </p>
                      <p className={`text-xs font-medium ${isPos ? 'text-green-400' : 'text-red-400'}`}>
                        {coin.usd_24h_change != null ? `${isPos ? '+' : ''}${coin.usd_24h_change.toFixed(2)}%` : '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>

      {/* Pool Stats */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Pool Stats
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Reserva TKA</span>
            {loadingPool
              ? <span className="w-16 h-4 bg-gray-700 rounded animate-pulse inline-block" />
              : <span className="font-mono">{formatBalance(reserveA)}</span>}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Reserva TKB</span>
            {loadingPool
              ? <span className="w-16 h-4 bg-gray-700 rounded animate-pulse inline-block" />
              : <span className="font-mono">{formatBalance(reserveB)}</span>}
          </div>
          <div className="flex justify-between border-t border-gray-700 pt-2 mt-1">
            <span className="text-gray-400">Tasa</span>
            <span className="font-mono text-purple-400">1 TKA = {exchangeRate} TKB</span>
          </div>
        </div>
      </div>

      {/* Network badge */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs text-gray-400">Sepolia Testnet</span>
      </div>
    </aside>
  );
};

export default Sidebar;
