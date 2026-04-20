import { useReadContract } from 'wagmi';
import { CONTRACTS, simpleDexABI } from '../config/contracts';

export function usePoolInfo() {
  const { data: reserveA, isLoading: loadingA, refetch: refetchA } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  const { data: reserveB, isLoading: loadingB, refetch: refetchB } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  const { data: priceA, isLoading: loadingPriceA } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [CONTRACTS.TOKEN_A],
  });

  const { data: priceB, isLoading: loadingPriceB } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'getPrice',
    args: [CONTRACTS.TOKEN_B],
  });

  const exchangeRate: string = (() => {
    if (typeof reserveA !== 'bigint' || typeof reserveB !== 'bigint' || reserveA === 0n) return '—';
    return (Number(reserveB) / Number(reserveA)).toFixed(4);
  })();

  return {
    reserveA: reserveA as bigint | undefined,
    reserveB: reserveB as bigint | undefined,
    priceA: priceA as bigint | undefined,
    priceB: priceB as bigint | undefined,
    exchangeRate,
    loading: loadingA || loadingB,
    loadingPriceA,
    loadingPriceB,
    refetch: () => { refetchA(); refetchB(); },
  };
}
