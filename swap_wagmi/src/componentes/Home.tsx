// Home.tsx
import React from 'react';
// Importaciones necesarias para la conexión de wallet
import { ConnectButton } from '@rainbow-me/rainbowkit'; // Componente de botón de conexión de RainbowKit
import { useAccount } from 'wagmi'; // Hook para obtener información de la cuenta conectada

const Home: React.FC = () => {
  // Hook useAccount: obtiene el estado de conexión y datos de la wallet
  // - isConnected: booleano que indica si hay una wallet conectada
  // - address: dirección de la wallet conectada (undefined si no hay conexión)
  // - chain: información de la blockchain a la que está conectada
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <div className="max-w-md mx-auto mt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ERC-20 Swap</h1>
          <p className="text-gray-400">Intercambio básico de Tokens</p>
        </div>

        {/* Swap Card */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          {/* Sección de conexión/swap */}
          <div className="space-y-4">
            {/* Botón de conexión: ConnectButton de RainbowKit */}
            {/* Se muestra siempre pero cambia su estado visual según la conexión */}
            <ConnectButton />
            
            {/* Información de la cuenta conectada (solo visible cuando está conectado) */}
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

        {/* Footer Info - Mensaje condicional basado en el estado de conexión */}
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