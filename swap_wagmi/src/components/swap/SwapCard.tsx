import React from 'react';
import { useSwap } from '../../hooks/useSwap';
import { formatBalance } from '../../utils/format';

const SwapCard: React.FC = () => {
  const {
    amountIn, setAmountIn,
    amountOut,
    direction,
    switchTokens,
    needsApproval,
    pendingAction,
    isProcessing,
    isConfirming,
    showSuccess,
    balanceA, balanceB,
    loadingBalanceA, loadingBalanceB,
    handleAction,
  } = useSwap();

  const fromToken = direction === 'AtoB' ? 'TKA' : 'TKB';
  const toToken   = direction === 'AtoB' ? 'TKB' : 'TKA';
  const fromBalance = direction === 'AtoB' ? balanceA : balanceB;
  const toBalance   = direction === 'AtoB' ? balanceB : balanceA;
  const loadingFrom = direction === 'AtoB' ? loadingBalanceA : loadingBalanceB;
  const loadingTo   = direction === 'AtoB' ? loadingBalanceB : loadingBalanceA;

  const buttonLabel = () => {
    if (isProcessing) {
      if (pendingAction === 'reset-approve') return isConfirming ? 'Reseteando allowance...' : 'Reseteando...';
      if (pendingAction === 'approve')       return isConfirming ? 'Confirmando approve...' : 'Aprobando...';
      return isConfirming ? 'Confirmando swap...' : 'Procesando...';
    }
    if (needsApproval) return `Aprobar ${fromToken}`;
    return 'Swap';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-6">Swap</h2>

      {/* From */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-400 text-sm">Desde</label>
          <span className="text-gray-400 text-sm">
            Balance: {loadingFrom ? '...' : formatBalance(fromBalance)}
          </span>
        </div>
        <div className="flex items-center bg-gray-700 rounded-lg p-3">
          <input
            type="number"
            placeholder="0.0"
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            className="bg-transparent w-full text-white text-xl outline-none"
          />
          <div className="flex items-center space-x-2 ml-2 shrink-0">
            <div className={`w-5 h-5 rounded-full ${direction === 'AtoB' ? 'bg-blue-500' : 'bg-green-500'}`} />
            <span className="font-medium text-sm">{fromToken}</span>
          </div>
        </div>
      </div>

      {/* Switch */}
      <div className="flex justify-center my-3">
        <button
          onClick={switchTokens}
          className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* To */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-400 text-sm">Hacia</label>
          <span className="text-gray-400 text-sm">
            Balance: {loadingTo ? '...' : formatBalance(toBalance)}
          </span>
        </div>
        <div className="flex items-center bg-gray-700 rounded-lg p-3">
          <input
            type="text"
            placeholder="0.0"
            value={amountOut}
            readOnly
            className="bg-transparent w-full text-white text-xl outline-none text-gray-400"
          />
          <div className="flex items-center space-x-2 ml-2 shrink-0">
            <div className={`w-5 h-5 rounded-full ${direction === 'AtoB' ? 'bg-green-500' : 'bg-blue-500'}`} />
            <span className="font-medium text-sm">{toToken}</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAction}
        disabled={!amountIn || isProcessing || Number(amountIn) <= 0}
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
            {buttonLabel()}
          </>
        ) : buttonLabel()}
      </button>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          Swap realizado con éxito
        </div>
      )}
    </div>
  );
};

export default SwapCard;
