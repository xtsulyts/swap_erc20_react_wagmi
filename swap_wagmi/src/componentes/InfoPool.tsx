import React from 'react';
import { useReadContract } from 'wagmi';
import simpleDexABI from "../contratos/simpleDexABI.json";

/**
 * Interfaz que define las propiedades requeridas por el componente InfoPool
 * @property SIMPLE_DEX_ADDRESS - Dirección del contrato DEX en formato string
 * @property TOKEN_A_ADDRESS - Dirección del Token A en formato string  
 * @property TOKEN_B_ADDRESS - Dirección del Token B en formato string
 * @property isConnected - Estado de conexión de la wallet del usuario
 * @property formatBalance - Función para formatear balances numéricos a string legible
 */
interface InfoPoolProps {
  SIMPLE_DEX_ADDRESS: string;
  TOKEN_A_ADDRESS: string;
  TOKEN_B_ADDRESS: string;
  isConnected: boolean;
  formatBalance: (balance: unknown, decimals?: number) => string;
}

/**
 * Componente InfoPool - Muestra información en tiempo real del pool de liquidez
 * Incluye reservas de tokens, precios actuales y tasa de cambio
 * Solo se renderiza cuando el usuario tiene su wallet conectada
 */
const InfoPool: React.FC<InfoPoolProps> = ({
  SIMPLE_DEX_ADDRESS,
  TOKEN_A_ADDRESS,
  TOKEN_B_ADDRESS,
  isConnected,
  formatBalance
}) => {
  // Hook para leer la reserva actual de Token A desde el contrato DEX
  const { data: reserveA, isLoading: loadingReserveA } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`, // Type casting para cumplir con el tipo esperado por wagmi
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  // Hook para leer la reserva actual de Token B desde el contrato DEX
  const { data: reserveB, isLoading: loadingReserveB } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`, // Type casting para cumplir con el tipo esperado por wagmi
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  // Hook para leer el precio actual de Token A en términos de Token B
  const { data: priceTokenA, isLoading: loadingPriceA } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`, // Type casting para cumplir con el tipo esperado por wagmi
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [TOKEN_A_ADDRESS as `0x${string}`], // Type casting para cumplir con el tipo esperado por wagmi
  });

  // Hook para leer el precio actual de Token B en términos de Token A
  const { data: priceTokenB, isLoading: loadingPriceB } = useReadContract({
    address: SIMPLE_DEX_ADDRESS as `0x${string}`, // Type casting para cumplir con el tipo esperado por wagmi
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [TOKEN_B_ADDRESS as `0x${string}`], // Type casting para cumplir con el tipo esperado por wagmi
  });

  /**
   * Calcula la tasa de cambio entre Token A y Token B basada en las reservas actuales
   * @returns Tasa de cambio formateada como string con 4 decimales
   */
  const calculateExchangeRate = () => {
    // Validar que existan reservas y que reserveA no sea cero para evitar división por cero
    if (!reserveA || !reserveB || reserveA === 0n) return '0.0';

    // Calcular la relación entre las reservas (Token B / Token A)
    return (Number(reserveB) / Number(reserveA)).toFixed(4);
  };

  // Calcular la tasa de cambio actual
  const exchangeRate = calculateExchangeRate();

  // Si el usuario no está conectado, no renderizar el componente
  if (!isConnected) return null;

  const formatReserva = (balance: bigint | undefined, decimals: number = 18): string => {
  if (!balance) return '0.0000';
  
  const balanceNumber = Number(balance);
  const tokens = balanceNumber / Math.pow(10, decimals);
  
  // Si el valor es muy pequeño, mostrar más decimales
  if (tokens < 0.001) {
    return tokens.toFixed(8);
  }
  
  return tokens.toFixed(4);
};

  // DEBUG: Ver valores reales
  console.log('🔴 reserveA raw:', reserveA, 'type:', typeof reserveA);
  console.log('🔴 reserveB raw:', reserveB, 'type:', typeof reserveB);
  console.log('🔴 priceTokenA raw:', priceTokenA);
  console.log('🔴 priceTokenB raw:', priceTokenB);

  return (
    <div className="mb-6 p-4 bg-gray-700 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Información del Pool</h3>
      <div className="space-y-2 text-sm">
        {/* Reserva de Token A */}
        <div className="flex justify-between">
          <span>Reserva TokenA:</span>
          {loadingReserveA ? (
            // Placeholder de carga mientras se obtienen los datos
            <span className="inline-block animate-pulse bg-gray-600 rounded w-20 h-4"></span>
          ) : (
            // Mostrar reserva formateada una vez cargada
            formatReserva(reserveA as bigint, 18)
          )}
        </div>

        {/* Reserva de Token B */}
        <div className="flex justify-between">
          <span>Reserva TokenB:</span>
          {loadingReserveB ? (
            // Placeholder de carga mientras se obtienen los datos
            <span className="inline-block animate-pulse bg-gray-600 rounded w-20 h-4"></span>
          ) : (
            // Mostrar reserva formateada una vez cargada
            formatReserva(reserveB as bigint, 18)
          )}
        </div>

        {/* Precio de Token A */}
        <div className="flex justify-between">
          <span>Precio TokenA:</span>
          {loadingPriceA ? (
            // Placeholder de carga mientras se obtienen los datos
            <span className="inline-block animate-pulse bg-gray-600 rounded w-20 h-4"></span>
          ) : (
            // Mostrar precio formateado una vez cargado
            formatBalance(priceTokenA as bigint)
          )}
        </div>

        {/* Precio de Token B */}
        <div className="flex justify-between">
          <span>Precio TokenB:</span>
          {loadingPriceB ? (
            // Placeholder de carga mientras se obtienen los datos
            <span className="inline-block animate-pulse bg-gray-600 rounded w-20 h-4"></span>
          ) : (
            // Mostrar precio formateado una vez cargado
            formatBalance(priceTokenB as bigint, 0)
          )}
        </div>

        {/* Tasa de cambio entre tokens */}
        <div className="flex justify-between">
          <span>Tasa de cambio:</span>
          <span>1 TokenA = {exchangeRate} TokenB</span>
        </div>
      </div>
    </div>
  );
};

export default InfoPool;