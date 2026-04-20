import React from 'react';
import { useSend, SendToken } from '../../hooks/useSend';
import { formatBalance } from '../../utils/format';

const TOKENS: SendToken[] = ['TKA', 'TKB'];

const TOKEN_COLOR: Record<SendToken, string> = {
  TKA: 'bg-blue-500',
  TKB: 'bg-green-500',
};

const SendCard: React.FC = () => {
  const {
    token, setToken,
    recipient, setRecipient,
    amount, setAmount,
    balance,
    isPending,
    isConfirming,
    showSuccess,
    isValidAddress,
    canSend,
    handleSend,
  } = useSend();

  const isProcessing = isPending || isConfirming;

  const buttonLabel = () => {
    if (isConfirming) return 'Confirmando...';
    if (isPending)    return 'Procesando...';
    return 'Enviar';
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Enviar Tokens</h2>

      {/* Token selector */}
      <div className="mb-6">
        <label className="text-gray-400 text-sm mb-2 block">Token</label>
        <div className="flex gap-2">
          {TOKENS.map((t) => (
            <button
              key={t}
              onClick={() => setToken(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors border ${
                token === t
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-gray-600 bg-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${TOKEN_COLOR[t]}`} />
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-4">
        <label className="text-gray-400 text-sm mb-2 block">Dirección destino</label>
        <input
          type="text"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className={`w-full bg-gray-700 rounded-lg p-3 text-sm font-mono outline-none transition-colors ${
            recipient && !isValidAddress
              ? 'border border-red-500 text-red-400'
              : 'border border-transparent focus:border-gray-500 text-white'
          }`}
        />
        {recipient && !isValidAddress && (
          <p className="text-red-400 text-xs mt-1">Dirección inválida</p>
        )}
      </div>

      {/* Amount */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-gray-400 text-sm">Cantidad</label>
          <span className="text-gray-400 text-sm">Balance: {formatBalance(balance)}</span>
        </div>
        <div className="flex items-center bg-gray-700 rounded-lg p-3">
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-transparent w-full text-white text-xl outline-none"
          />
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <span className={`w-3 h-3 rounded-full ${TOKEN_COLOR[token]}`} />
            <span className="font-medium text-sm">{token}</span>
          </div>
        </div>
      </div>

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
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

      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium">
          Tokens enviados con éxito
        </div>
      )}
    </div>
  );
};

export default SendCard;
