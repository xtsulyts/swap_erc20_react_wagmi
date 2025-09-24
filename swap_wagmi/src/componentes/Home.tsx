// Home.tsx
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract } from 'wagmi';
import  simpleDexABI  from "../contratos/simpleDexABI.json";
import  tokenAABI from '../contratos/erc20ABI/tokenAABI.json';
import  tokenBABI from '../contratos/erc20ABI/tokenBABI.json';

// Direcciones de los contratos (debes definirlas en un archivo de configuración)
const SIMPLE_DEX_ADDRESS = '0x3D5B5a5328a0f29375b3cDcBE31B1aB5c2AB906A';
const TOKEN_A_ADDRESS = '0x039EC09b85F1C317F0831B100eFd5c4e2463f372';
const TOKEN_B_ADDRESS = '0xBeaC73A7755BeED1337Ca95137EB8b9247f88542';

const Home: React.FC = () => {
  const { isConnected, address } = useAccount();

  // Hook para leer reserveA del contrato SimpleDEX
  const { 
    data: reserveA, 
    isLoading: loadingReserveA,
    error: errorReserveA 
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  // Hook para leer reserveB del contrato SimpleDEX
  const { 
    data: reserveB, 
    isLoading: loadingReserveB,
    error: errorReserveB 
  } = useReadContract({
    address: SIMPLE_DEX_ADDRESS,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  // Hook para leer balance de TokenA del usuario
  const { 
    data: balanceTokenA, 
    isLoading: loadingBalanceA,
    error: errorBalanceA 
  } = useReadContract({
    address: TOKEN_A_ADDRESS,
    abi: tokenAABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Solo ejecutar si hay address conectado
    }
  });

  // Hook para leer balance de TokenB del usuario
  const { 
    data: balanceTokenB, 
    isLoading: loadingBalanceB,
    error: errorBalanceB 
  } = useReadContract({
    address: TOKEN_B_ADDRESS,
    abi: tokenBABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address, // Solo ejecutar si hay address conectado
    }
  });

  // Hook para leer precio de TokenA
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

  // Hook para leer precio de TokenB
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

  // Función para formatear grandes números (para mostrar en UI)
  const formatBalance = (balance: bigint | undefined, decimals: number = 18) => {
    if (!balance) return '0.0';
    return (Number(balance) / 10 ** decimals).toFixed(4);
  };

  // Calcular tasa de cambio basada en las reservas
  const calculateExchangeRate = () => {
    if (!reserveA || !reserveB || reserveA === 0n) return '0.0';
    return (Number(reserveB) / Number(reserveA)).toFixed(4);
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
          {/* Información del Pool */}
          {isConnected && (
            <div className="mb-6 p-4 bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Información del Pool</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Reserva TokenA:</span>
                  <span>
                    {loadingReserveA ? 'Cargando...' : formatBalance(reserveA)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reserva TokenB:</span>
                  <span>
                    {loadingReserveB ? 'Cargando...' : formatBalance(reserveB)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tasa de cambio:</span>
                  <span>1 TokenA = {calculateExchangeRate()} TokenB</span>
                </div>
              </div>
            </div>
          )}

          {/* Balances del Usuario */}
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

          {/* Sección de conexión */}
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

          {/* Sección de Swap (próximo paso) */}
          {isConnected && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <p className="text-center text-gray-300">
                Interfaz de swap en desarrollo...
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
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