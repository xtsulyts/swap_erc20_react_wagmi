// Home.tsx
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ETH Swap</h1>
          <p className="text-gray-400">Intercambio básico en Ethereum</p>
        </div>

        {/* Swap Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          {/* From Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Desde</label>
              <span className="text-gray-400 text-sm">Balance: 0.0</span>
            </div>
            <div className="flex items-center bg-gray-700 rounded-lg p-3">
              <input 
                type="number" 
                placeholder="0.0"
                className="bg-transparent w-full text-white text-xl outline-none"
              />
              <div className="flex items-center space-x-2 ml-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <span className="font-medium">ETH</span>
              </div>
            </div>
          </div>

          {/* Swap Arrow */}
          <div className="flex justify-center my-2">
            <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
          </div>

          {/* To Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-400 text-sm">Hacia</label>
              <span className="text-gray-400 text-sm">Balance: 0.0</span>
            </div>
            <div className="flex items-center bg-gray-700 rounded-lg p-3">
              <input 
                type="number" 
                placeholder="0.0"
                className="bg-transparent w-full text-white text-xl outline-none"
              />
              <div className="flex items-center space-x-2 ml-2">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <span className="font-medium">USDC</span>
              </div>
            </div>
          </div>

          {/* Connect Wallet Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Conectar Wallet
          </button>

          {/* Swap Info */}
          <div className="mt-4 text-sm text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Tasa de cambio:</span>
              <span>1 ETH = 2500 USDC</span>
            </div>
            <div className="flex justify-between">
              <span>Comisión:</span>
              <span>0.3%</span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Conecta tu wallet para comenzar a hacer swaps</p>
        </div>
      </div>
    </div>
  );
};

export default Home;