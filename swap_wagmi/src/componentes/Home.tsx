// Home.tsx
import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import simpleDexABI from "../contratos/simpleDexABI.json";
import tokenAABI from '../contratos/erc20ABI/tokenAABI.json';
import tokenBABI from '../contratos/erc20ABI/tokenBABI.json';

// Direcciones de los contratos
const SIMPLE_DEX_ADDRESS = '0x3D5B5a5328a0f29375b3cDcBE31B1aB5c2AB906A';
const TOKEN_A_ADDRESS = '0x039EC09b85F1C317F0831B100eFd5c4e2463f372';
const TOKEN_B_ADDRESS = '0xBeaC73A7755BeED1337Ca95137EB8b9247f88542';

const Home: React.FC = () => {
  const { isConnected, address } = useAccount();
  const { writeContract } = useWriteContract();

  // Estados para el swap
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('0.0');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapDirection, setSwapDirection] = useState<'AtoB' | 'BtoA'>('AtoB');

  // Hooks de lectura 
  const {
    data: reserveA,
    isLoading: loadingReserveA,
    // error: errorReserveA
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  const {
    data: reserveB,
    isLoading: loadingReserveB,
    //error: errorReserveB
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  const {
    data: balanceTokenA,
    isLoading: loadingBalanceA,
    refetch: refetchBalanceA
  } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: tokenAABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const {
    data: balanceTokenB,
    isLoading: loadingBalanceB,
    refetch: refetchBalanceB
  } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: tokenBABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const {
    data: priceTokenA,
    isLoading: loadingPriceA,
    error: errorPriceA
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [TOKEN_A_ADDRESS],
  });

  const {
    data: priceTokenB,
    isLoading: loadingPriceB,
    error: errorPriceB
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [TOKEN_B_ADDRESS],
  });

  // Calcular amountOut basado en el input (manteniendo la misma lógica)
  useEffect(() => {
    if (!amountIn || !reserveA || !reserveB || reserveA === 0n || reserveB === 0n) {
      setAmountOut('0.0');
      return;
    }

    try {
      const amountInWei = BigInt(Number(amountIn) * 10 ** 18);
      let calculatedOut = 0;

      if (swapDirection === 'AtoB') {
        calculatedOut = Number(reserveB) - Number((reserveA * reserveB) / (reserveA + amountInWei));
      } else {
        calculatedOut = Number(reserveA) - Number((reserveA * reserveB) / (reserveB + amountInWei));
      }

      setAmountOut((calculatedOut / 10 ** 18).toFixed(6));
    } catch (error) {
      setAmountOut('0.0');
    }
  }, [amountIn, swapDirection, reserveA, reserveB]);

  // Función para ejecutar el swap
  const handleSwap = async () => {
    if (!amountIn || !address) return;

    try {
      setIsSwapping(true);
      const amountInWei = BigInt(Number(amountIn) * 10 ** 18);

      if (swapDirection === 'AtoB') {
        writeContract({
          address: SIMPLE_DEX_ADDRESS,
          abi: simpleDexABI,
          functionName: 'swapAforB',
          args: [amountInWei],
        });
      } else {
        writeContract({
          address: SIMPLE_DEX_ADDRESS,
          abi: simpleDexABI,
          functionName: 'swapBforA',
          args: [amountInWei],
        });
      }

      // Esperar y actualizar balances
      setTimeout(() => {
        refetchBalanceA();
        refetchBalanceB();
        setIsSwapping(false);
        setAmountIn('');
        setAmountOut('0.0');
      }, 3000);

    } catch (error) {
      console.error('Error en swap:', error);
      setIsSwapping(false);
    }
  };

  // Función para formatear balances (MANTENIENDO EXACTAMENTE LA MISMA)
  const formatBalance = (balance: bigint | undefined, decimals: number = 18) => {
    if (!balance) return '0.0';

    const balanceStr = balance.toString().padStart(decimals + 1, '0');
    const wholePart = balanceStr.slice(0, -decimals) || '0';
    const fractionalPart = balanceStr.slice(-decimals).slice(0, 4);
    const cleanWhole = wholePart.replace(/^0+/, '') || '0';

    return `${cleanWhole}.${fractionalPart}`;
  };

  // Calcular tasa de cambio (MANTENIENDO EXACTAMENTE LA MISMA)
  const calculateExchangeRate = () => {
    if (!reserveA || !reserveB || reserveA === 0n) return '0.0';
    return (Number(reserveB) / Number(reserveA)).toFixed(4);
  };

  // Intercambiar dirección del swap
  const switchTokens = () => {
    setSwapDirection(swapDirection === 'AtoB' ? 'BtoA' : 'AtoB');
    setAmountIn('');
    setAmountOut('0.0');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ERC-20 Swap</h1>
          <p className="text-gray-400">Intercambio de Tokens</p>
        </div>

        {/* Swap Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          {/* Información del Pool - MANTENIENDO EXACTAMENTE LA MISMA VISUALIZACIÓN */}
          {isConnected && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Información del Pool</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Reserva TokenA:</span>
                  <span>
                    {loadingReserveA ? 'Cargando...' : reserveA?.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reserva TokenB:</span>
                  <span>
                    {loadingReserveB ? 'Cargando...' : reserveB?.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa de cambio:</span>
                  <span>1 TokenA = {calculateExchangeRate()} TokenB</span>
                </div>
              </div>
            </div>
          )}

          {/* Balances del Usuario - MANTENIENDO EXACTAMENTE LA MISMA VISUALIZACIÓN */}
          {isConnected && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Tus Balances</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>TokenA:</span>
                  <span>
                    {loadingBalanceA ? 'Cargando...' : formatBalance(balanceTokenA)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TokenB:</span>
                  <span>
                    {loadingBalanceB ? 'Cargando...' : formatBalance(balanceTokenB)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* INTERFAZ DE SWAP - NUEVA SECCIÓN */}
          {isConnected && (
            <div className="space-y-4 mb-6">
              {/* From Section */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-sm">Desde</label>
                  <span className="text-gray-400 text-sm">
                    Balance: {swapDirection === 'AtoB' ? 
                      (loadingBalanceA ? '...' : formatBalance(balanceTokenA)) : 
                      (loadingBalanceB ? '...' : formatBalance(balanceTokenB))}
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
                  <div className="flex items-center space-x-2 ml-2">
                    <div className={`w-6 h-6 rounded-full ${swapDirection === 'AtoB' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                    <span className="font-medium">
                      {swapDirection === 'AtoB' ? 'TokenA' : 'TokenB'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Arrow */}
              <div className="flex justify-center my-2">
                <button 
                  onClick={switchTokens}
                  className="bg-gray-600 hover:bg-gray-500 p-2 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-gray-400 text-sm">Hacia</label>
                  <span className="text-gray-400 text-sm">
                    Balance: {swapDirection === 'AtoB' ? 
                      (loadingBalanceB ? '...' : formatBalance(balanceTokenB)) : 
                      (loadingBalanceA ? '...' : formatBalance(balanceTokenA))}
                  </span>
                </div>
                <div className="flex items-center bg-gray-700 rounded-lg p-3">
                  <input 
                    type="text" 
                    placeholder="0.0"
                    value={amountOut}
                    readOnly
                    className="bg-transparent w-full text-white text-xl outline-none"
                  />
                  <div className="flex items-center space-x-2 ml-2">
                    <div className={`w-6 h-6 rounded-full ${swapDirection === 'AtoB' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                    <span className="font-medium">
                      {swapDirection === 'AtoB' ? 'TokenB' : 'TokenA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <button 
                onClick={handleSwap}
                disabled={!amountIn || isSwapping || Number(amountIn) <= 0}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isSwapping ? 'Procesando swap...' : 'Swap'}
              </button>
            </div>
          )}

          {/* Sección de conexión - MANTENIENDO EXACTAMENTE LA MISMA */}
          <div className="space-y-4">
            <ConnectButton />

            {isConnected && (
              <div className="text-center p-3 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-300">Conectado como:</p>
                <p className="text-sm font-mono text-blue-400">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info - MANTENIENDO EXACTAMENTE LA MISMA */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>
            {isConnected
              ? '¡Listo! Ya puedes realizar swaps'
              : 'Conecta tu wallet para comenzar a hacer swaps'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;  