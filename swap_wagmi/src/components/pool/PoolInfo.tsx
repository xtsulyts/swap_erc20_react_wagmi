import React from 'react';
import { usePoolInfo } from '../../hooks/usePoolInfo';
import { formatBalance } from '../../utils/format';

const PoolInfo: React.FC = () => {
  const { reserveA, reserveB, priceA, priceB, exchangeRate, loading, loadingPriceA, loadingPriceB } = usePoolInfo();

  const Skeleton = () => (
    <span className="inline-block animate-pulse bg-gray-600 rounded w-20 h-4" />
  );

  return (
    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-3">Pool Info</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Reserva TokenA</span>
          {loading ? <Skeleton /> : <span>{formatBalance(reserveA)}</span>}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Reserva TokenB</span>
          {loading ? <Skeleton /> : <span>{formatBalance(reserveB)}</span>}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Precio TokenA</span>
          {loadingPriceA ? <Skeleton /> : <span>{formatBalance(priceA, 0)}</span>}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Precio TokenB</span>
          {loadingPriceB ? <Skeleton /> : <span>{formatBalance(priceB, 0)}</span>}
        </div>
        <div className="flex justify-between border-t border-gray-600 pt-2 mt-2">
          <span className="text-gray-400">Tasa de cambio</span>
          <span>1 TKA = {exchangeRate} TKB</span>
        </div>
      </div>
    </div>
  );
};

export default PoolInfo;
