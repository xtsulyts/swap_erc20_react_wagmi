import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, simpleDexABI, tokenAABI, tokenBABI } from '../config/contracts';

export type LiquidityTab = 'add' | 'remove';

export function useLiquidity() {
  const { address } = useAccount();

  const [amountA, setAmountA]   = useState('');
  const [amountB, setAmountB]   = useState('');
  const [activeTab, setActiveTab] = useState<LiquidityTab>('add');

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // --- Pool reserves ---
  const { data: reserveA, refetch: refetchReserveA } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  const { data: reserveB, refetch: refetchReserveB } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  // --- User balances ---
  const { data: balanceA, refetch: refetchBalanceA } = useReadContract({
    address: CONTRACTS.TOKEN_A,
    abi: tokenAABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: balanceB, refetch: refetchBalanceB } = useReadContract({
    address: CONTRACTS.TOKEN_B,
    abi: tokenBABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // --- Auto-calculate amountB proportionally ---
  useEffect(() => {
    if (!amountA || typeof reserveA !== 'bigint' || typeof reserveB !== 'bigint' || reserveA === 0n) {
      setAmountB('');
      return;
    }
    const amountAWei = BigInt(Math.floor(Number(amountA) * 10 ** 18));
    const calculated = (amountAWei * reserveB) / reserveA;
    setAmountB((Number(calculated) / 10 ** 18).toFixed(6));
  }, [amountA, reserveA, reserveB]);

  // --- Reset after confirmed tx ---
  useEffect(() => {
    if (!isConfirmed) return;
    setAmountA('');
    setAmountB('');
    refetchReserveA();
    refetchReserveB();
    refetchBalanceA();
    refetchBalanceB();
  }, [isConfirmed]);

  const handleAddLiquidity = () => {
    if (!amountA || !amountB) return;
    writeContract({
      address: CONTRACTS.SIMPLE_DEX,
      abi: simpleDexABI,
      functionName: 'addLiquidity',
      args: [
        BigInt(Math.floor(Number(amountA) * 10 ** 18)),
        BigInt(Math.floor(Number(amountB) * 10 ** 18)),
      ],
    });
  };

  const handleRemoveLiquidity = () => {
    if (!amountA || !amountB) return;
    writeContract({
      address: CONTRACTS.SIMPLE_DEX,
      abi: simpleDexABI,
      functionName: 'removeLiquidity',
      args: [
        BigInt(Math.floor(Number(amountA) * 10 ** 18)),
        BigInt(Math.floor(Number(amountB) * 10 ** 18)),
      ],
    });
  };

  return {
    amountA,
    setAmountA,
    amountB,
    activeTab,
    setActiveTab,
    isProcessing: isPending || isConfirming,
    isConfirming,
    isConfirmed,
    reserveA: reserveA as bigint | undefined,
    reserveB: reserveB as bigint | undefined,
    balanceA: balanceA as bigint | undefined,
    balanceB: balanceB as bigint | undefined,
    handleAddLiquidity,
    handleRemoveLiquidity,
  };
}
