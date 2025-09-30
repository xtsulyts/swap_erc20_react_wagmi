import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import simpleDexABI from "../contratos/simpleDexABI.json";
import tokenAABI from '../contratos/erc20ABI/tokenAABI.json';
import tokenBABI from '../contratos/erc20ABI/tokenBABI.json';

interface LiquidityProps {
  SIMPLE_DEX_ADDRESS: string;
  TOKEN_A_ADDRESS: string;
  TOKEN_B_ADDRESS: string;
  isConnected: boolean;
  formatBalance: (balance: unknown, decimals?: number) => string;
}

const Liquidity: React.FC<LiquidityProps> = ({
  SIMPLE_DEX_ADDRESS,
  TOKEN_A_ADDRESS,
  TOKEN_B_ADDRESS,
  isConnected,
  formatBalance
}) => {
  const { address } = useAccount(); // ← Agregar useAccount aquí
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  
  const { data: hash, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Leer reservas del pool
  const { data: reserveA, refetch: refetchReserveA } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  const { data: reserveB, refetch: refetchReserveB } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  // Leer balances del usuario
  const { data: balanceTokenA, refetch: refetchBalanceA } = useReadContract({
    address: TOKEN_A_ADDRESS as `0x${string}`,
    abi: tokenAABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: balanceTokenB, refetch: refetchBalanceB } = useReadContract({
    address: TOKEN_B_ADDRESS as `0x${string}`,
    abi: tokenBABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  // Calcular amountB automáticamente basado en amountA
  useEffect(() => {
    if (amountA && reserveA && reserveB && reserveA > 0n) {
      const amountAWei = BigInt(Number(amountA) * 10 ** 18);
      const calculatedB = (amountAWei * reserveB) / reserveA;
      setAmountB((Number(calculatedB) / 10 ** 18).toFixed(6));
    } else {
      setAmountB('');
    }
  }, [amountA, reserveA, reserveB]);

  // Manejar add liquidity
  const handleAddLiquidity = async () => {
    if (!amountA || !amountB) return;

    try {
      const amountAWei = BigInt(Number(amountA) * 10 ** 18);
      const amountBWei = BigInt(Number(amountB) * 10 ** 18);

      writeContract({
        address: SIMPLE_DEX_ADDRESS as `0x${string}`,
        abi: simpleDexABI,
        functionName: 'addLiquidity',
        args: [amountAWei, amountBWei],
      });
    } catch (error) {
      console.error('Error agregando liquidez:', error);
    }
  };

  // Manejar remove liquidity
  const handleRemoveLiquidity = async () => {
    if (!amountA || !amountB) return;

    try {
      const amountAWei = BigInt(Number(amountA) * 10 ** 18);
      const amountBWei = BigInt(Number(amountB) * 10 ** 18);

      writeContract({
        address: SIMPLE_DEX_ADDRESS as `0x${string}`,
        abi: simpleDexABI,
        functionName: 'removeLiquidity',
        args: [amountAWei, amountBWei],
      });
    } catch (error) {
      console.error('Error removiendo liquidez:', error);
    }
  };

  // Resetear form después de transacción exitosa
  useEffect(() => {
    if (isConfirmed) {
      setAmountA('');
      setAmountB('');
      refetchReserveA();
      refetchReserveB();
      refetchBalanceA();
      refetchBalanceB();
    }
  }, [isConfirmed]);

  if (!isConnected) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 text-center">
        <p className="text-gray-400">Conecta tu wallet para gestionar liquidez</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Gestión de Liquidez</h2>
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('add')}
        >
          Agregar Liquidez
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === 'remove' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
          onClick={() => setActiveTab('remove')}
        >
          Remover Liquidez
        </button>
      </div>

      {/* Información del Pool */}
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Pool Actual</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Reserva TokenA:</span>
            <span>{formatBalance(reserveA, 18)}</span>
          </div>
          <div className="flex justify-between">
            <span>Reserva TokenB:</span>
            <span>{formatBalance(reserveB, 18)}</span>
          </div>
        </div>
      </div>

      {/* Formulario de Liquidez */}
      <div className="space-y-4">
        {/* Input Token A */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400">Token A</label>
            <span className="text-gray-400">
              Balance: {formatBalance(balanceTokenA)}
            </span>
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <input 
              type="number" 
              placeholder="0.0"
              value={amountA}
              onChange={(e) => setAmountA(e.target.value)}
              className="bg-transparent w-full text-white text-xl outline-none"
            />
            <span className="ml-2 font-medium">TokenA</span>
          </div>
        </div>

        {/* Input Token B */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-400">Token B</label>
            <span className="text-gray-400">
              Balance: {formatBalance(balanceTokenB)}
            </span>
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-3">
            <input 
              type="text" 
              placeholder="0.0"
              value={amountB}
              readOnly
              className="bg-transparent w-full text-white text-xl outline-none"
            />
            <span className="ml-2 font-medium">TokenB</span>
          </div>
        </div>

        {/* Botón de Acción */}
        <button 
          onClick={activeTab === 'add' ? handleAddLiquidity : handleRemoveLiquidity}
          disabled={!amountA || isConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isConfirming ? 'Confirmando...' : activeTab === 'add' ? 'Agregar Liquidez' : 'Remover Liquidez'}
        </button>
      </div>
    </div>
  );
};

export default Liquidity;