import React from 'react';
import { useTxHistory, TxEvent } from '../../hooks/useTxHistory';
import { CONTRACTS } from '../../config/contracts';
import { formatBalance } from '../../utils/format';

const ETHERSCAN = 'https://sepolia.etherscan.io';

const TYPE_STYLES = {
  swap:   { label: 'Swap',   bg: 'bg-blue-500/20',   text: 'text-blue-400'  },
  add:    { label: 'Add',    bg: 'bg-green-500/20',  text: 'text-green-400' },
  remove: { label: 'Remove', bg: 'bg-red-500/20',    text: 'text-red-400'   },
};

function shortAddr(addr?: string) {
  if (!addr) return '—';
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function SwapDetail({ event }: { event: TxEvent }) {
  const isAtoB = event.tokenIn?.toLowerCase() === CONTRACTS.TOKEN_A.toLowerCase();
  return (
    <p className="text-xs text-gray-300 mt-0.5">
      {formatBalance(event.amountIn)}{' '}
      <span className="text-blue-400">{isAtoB ? 'TKA' : 'TKB'}</span>
      {' → '}
      {formatBalance(event.amountOut)}{' '}
      <span className="text-green-400">{isAtoB ? 'TKB' : 'TKA'}</span>
    </p>
  );
}

function LiquidityDetail({ event }: { event: TxEvent }) {
  return (
    <p className="text-xs text-gray-300 mt-0.5">
      {formatBalance(event.amountA)}{' '}
      <span className="text-blue-400">TKA</span>
      {' + '}
      {formatBalance(event.amountB)}{' '}
      <span className="text-purple-400">TKB</span>
    </p>
  );
}

function TxRow({ event }: { event: TxEvent }) {
  const style = TYPE_STYLES[event.type];
  const actor = event.swapper ?? event.provider;

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-gray-700/50 last:border-0">
      <div className="flex items-start gap-2 min-w-0">
        <span className={`shrink-0 mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 truncate">{shortAddr(actor)}</p>
          {event.type === 'swap'
            ? <SwapDetail event={event} />
            : <LiquidityDetail event={event} />}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="text-xs text-gray-500">#{event.blockNumber.toString()}</p>
        {event.hash && (
          <a
            href={`${ETHERSCAN}/tx/${event.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-400 transition-colors"
          >
            ver →
          </a>
        )}
      </div>
    </div>
  );
}

const TxHistory: React.FC = () => {
  const { data: events, isLoading, isFetching, isError } = useTxHistory();

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-gray-700">
        <h3 className="text-sm font-semibold">Historial</h3>
        {isFetching && (
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>

      <div className="overflow-y-auto max-h-[560px] px-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="py-3 border-b border-gray-700/50 last:border-0 flex gap-3">
              <div className="w-12 h-4 bg-gray-700 rounded-full animate-pulse shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5">
                <div className="w-20 h-3 bg-gray-700 rounded animate-pulse" />
                <div className="w-32 h-3 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          ))
        ) : isError ? (
          <p className="text-red-400 text-sm text-center py-8">Error al cargar historial</p>
        ) : !events || events.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">Sin transacciones recientes</p>
        ) : (
          events.map((event, i) => <TxRow key={`${event.hash}-${i}`} event={event} />)
        )}
      </div>
    </div>
  );
};

export default TxHistory;
