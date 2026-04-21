import React from 'react';
import { useAccount } from 'wagmi';
import LiquidityCard from '../components/liquidity/LiquidityCard';
import Sidebar from '../components/sidebar/Sidebar';

const LiquidityPage: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 pt-28 sm:pt-20 pb-10">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20">
              <Sidebar />
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 max-w-lg mx-auto lg:mx-0">
            {isConnected ? (
              <LiquidityCard />
            ) : (
              <div className="bg-gray-800 rounded-xl p-10 text-center border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Conecta tu wallet para gestionar liquidez</p>
                <p className="text-gray-600 text-xs">Usá el botón en la barra superior</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityPage;
