import React from 'react';
import SwapCard from '../components/swap/SwapCard';
import PriceChart from '../components/charts/PriceChart';
import Sidebar from '../components/sidebar/Sidebar';
import TxHistory from '../components/history/TxHistory';

const SwapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
        <div className="flex gap-6">

          {/* Left sidebar — precios + pool stats */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </div>

          {/* Main — chart + swap */}
          <div className="flex-1 min-w-0 max-w-lg mx-auto lg:mx-0">
            <PriceChart />
            <SwapCard />
          </div>

          {/* Right — historial de transacciones */}
          <div className="hidden xl:block w-72 shrink-0">
            <div className="sticky top-20">
              <TxHistory />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SwapPage;
