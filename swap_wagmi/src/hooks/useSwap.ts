import { useState, useEffect, useRef } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACTS, simpleDexABI, tokenAABI, tokenBABI } from '../config/contracts';

export type SwapDirection = 'AtoB' | 'BtoA';
type PendingAction = 'reset-approve' | 'approve' | 'swap' | null;

export function useSwap() {
  const { address } = useAccount();

  const [amountIn, setAmountIn]         = useState('');
  const [amountOut, setAmountOut]       = useState('');
  const [direction, setDirection]       = useState<SwapDirection>('AtoB');
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [showSuccess, setShowSuccess]   = useState(false);
  // Saves the amount across the async reset → approve → swap sequence
  const pendingAmountRef = useRef<bigint>(0n);

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // --- Balances ---
  const { data: balanceA, isLoading: loadingBalanceA, refetch: refetchBalanceA } = useReadContract({
    address: CONTRACTS.TOKEN_A,
    abi: tokenAABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: balanceB, isLoading: loadingBalanceB, refetch: refetchBalanceB } = useReadContract({
    address: CONTRACTS.TOKEN_B,
    abi: tokenBABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // --- Allowances ---
  const { data: allowanceA, refetch: refetchAllowanceA } = useReadContract({
    address: CONTRACTS.TOKEN_A,
    abi: tokenAABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.SIMPLE_DEX] : undefined,
    query: { enabled: !!address },
  });

  const { data: allowanceB, refetch: refetchAllowanceB } = useReadContract({
    address: CONTRACTS.TOKEN_B,
    abi: tokenBABI,
    functionName: 'allowance',
    args: address ? [address, CONTRACTS.SIMPLE_DEX] : undefined,
    query: { enabled: !!address },
  });

  // --- Reserves (for amountOut calculation) ---
  const { data: reserveA } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveA',
  });

  const { data: reserveB } = useReadContract({
    address: CONTRACTS.SIMPLE_DEX,
    abi: simpleDexABI,
    functionName: 'reserveB',
  });

  // --- Calculate amountOut (constant product formula: x*y=k) ---
  useEffect(() => {
    const parsed = Number(amountIn);
    if (!amountIn || parsed <= 0 || typeof reserveA !== 'bigint' || typeof reserveB !== 'bigint') {
      setAmountOut('');
      return;
    }
    if (reserveA === 0n || reserveB === 0n) {
      setAmountOut('');
      return;
    }
    const amountInWei = BigInt(Math.floor(parsed * 10 ** 18));
    const [resIn, resOut] = direction === 'AtoB' ? [reserveA, reserveB] : [reserveB, reserveA];
    const out = (amountInWei * resOut) / (resIn + amountInWei);
    setAmountOut((Number(out) / 10 ** 18).toFixed(6));
  }, [amountIn, direction, reserveA, reserveB]);

  // --- Derive needsApproval ---
  const amountInWei = amountIn && Number(amountIn) > 0
    ? BigInt(Math.floor(Number(amountIn) * 10 ** 18))
    : 0n;

  const currentAllowance = (
    direction === 'AtoB' ? (allowanceA as bigint | undefined) : (allowanceB as bigint | undefined)
  ) ?? 0n;

  const needsApproval = amountInWei > 0n && currentAllowance < amountInWei;

  // --- Handle confirmed transaction ---
  useEffect(() => {
    if (!isConfirmed) return;

    if (pendingAction === 'reset-approve') {
      // Allowance reset to 0 confirmed — now approve the real amount
      const tokenAddress = direction === 'AtoB' ? CONTRACTS.TOKEN_A : CONTRACTS.TOKEN_B;
      const tokenABI     = direction === 'AtoB' ? tokenAABI : tokenBABI;
      setPendingAction('approve');
      writeContract({
        address: tokenAddress,
        abi: tokenABI,
        functionName: 'approve',
        args: [CONTRACTS.SIMPLE_DEX, pendingAmountRef.current],
      });
    } else if (pendingAction === 'approve') {
      refetchAllowanceA();
      refetchAllowanceB();
      setPendingAction(null);
    } else if (pendingAction === 'swap') {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setAmountIn('');
      setAmountOut('');
      refetchBalanceA();
      refetchBalanceB();
      refetchAllowanceA();
      refetchAllowanceB();
      setPendingAction(null);
    }
  }, [isConfirmed]);

  // --- Main action handler ---
  const handleAction = () => {
    if (!amountIn || !address || Number(amountIn) <= 0) return;

    if (needsApproval) {
      pendingAmountRef.current = amountInWei;
      const tokenAddress = direction === 'AtoB' ? CONTRACTS.TOKEN_A : CONTRACTS.TOKEN_B;
      const tokenABI     = direction === 'AtoB' ? tokenAABI : tokenBABI;

      if (currentAllowance > 0n) {
        // Token requires resetting to 0 before setting a new allowance
        setPendingAction('reset-approve');
        writeContract({
          address: tokenAddress,
          abi: tokenABI,
          functionName: 'approve',
          args: [CONTRACTS.SIMPLE_DEX, 0n],
        });
      } else {
        setPendingAction('approve');
        writeContract({
          address: tokenAddress,
          abi: tokenABI,
          functionName: 'approve',
          args: [CONTRACTS.SIMPLE_DEX, amountInWei],
        });
      }
    } else {
      setPendingAction('swap');
      writeContract({
        address: CONTRACTS.SIMPLE_DEX,
        abi: simpleDexABI,
        functionName: direction === 'AtoB' ? 'swapAforB' : 'swapBforA',
        args: [amountInWei],
      });
    }
  };

  const switchTokens = () => {
    setDirection(d => d === 'AtoB' ? 'BtoA' : 'AtoB');
    setAmountIn('');
    setAmountOut('');
  };

  const isProcessing = isPending || isConfirming;

  return {
    amountIn,
    setAmountIn,
    amountOut,
    direction,
    switchTokens,
    needsApproval,
    pendingAction,
    isProcessing,
    isConfirming,
    showSuccess,
    balanceA: balanceA as bigint | undefined,
    balanceB: balanceB as bigint | undefined,
    loadingBalanceA,
    loadingBalanceB,
    handleAction,
  };
}
