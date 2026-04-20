import React from 'react';
import { useLiquidity } from '../../hooks/useLiquidity';
import { formatBalance } from '../../utils/format';

const LiquidityCard: React.FC = () => {
  const {
    amountA, setAmountA,
    amountB,
    activeTab, setActiveTab,
    isProcessing,
    isConfirming,
    isConfirmed,
    reserveA, reserveB,
    balanceA, balanceB,
    handleAddLiquidity,
    handleRemoveLiquidity,
  } = useLiquidity();

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Gestión de Liquidez</h2>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {(['add', 'remove'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'add' ? 'Agregar' : 'Remover'}
          </button>
        ))}
      </div>

      {/* Pool reserves */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg text-sm">
        <p className="text-gray-400 mb-2 font-medium">Reservas del pool</p>
        <div className="flex justify-between">
          <span className="text-gray-400">TKA</span>
          <span>{formatBalance(reserveA)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">TKB</span>
          <span>{formatBalance(reserveB)}</span>
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 text-sm">Token A</label>
            <span className="text-gray-400 text-sm">Balance: {formatBalance(balanceA)}</span>
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <input
              type="number"
              placeholder="0.0"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              className="bg-transparent w-full text-white text-xl outline-none"
            />
            <span className="ml-2 font-medium text-sm shrink-0">TKA</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400 text-sm">Token B</label>
            <span className="text-gray-400 text-sm">Balance: {formatBalance(balanceB)}</span>
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <input
              type="text"
              placeholder="0.0"
              value={amountB}
              readOnly
              className="bg-transparent w-full text-white text-xl outline-none text-gray-400"
            />
            <span className="ml-2 font-medium text-sm shrink-0">TKB</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={activeTab === 'add' ? handleAddLiquidity : handleRemoveLiquidity}
        disabled={!amountA || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
          text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {isConfirming ? 'Confirmando...' : 'Procesando...'}
          </>
        ) : (
          activeTab === 'add' ? 'Agregar Liquidez' : 'Remover Liquidez'
        )}
      </button>

      {isConfirmed && (
        <p className="text-center text-green-400 text-sm mt-3">Transacción confirmada</p>
      )}
    </div>
  );
};

export default LiquidityCard;
