import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, isAddress } from 'viem';
import { CONTRACTS, tokenAABI, tokenBABI } from '../config/contracts';

export type SendToken = 'TKA' | 'TKB';

export function useSend() {
  const { address } = useAccount();
  const [token, setToken] = useState<SendToken>('TKA');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const abi    = token === 'TKA' ? tokenAABI : tokenBABI;
  const contractAddress = token === 'TKA' ? CONTRACTS.TOKEN_A : CONTRACTS.TOKEN_B;

  const { data: balance } = useReadContract({
    address: contractAddress,
    abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { writeContract, data: txHash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isValidAddress = isAddress(recipient);
  const isValidAmount  = !!amount && Number(amount) > 0;
  const canSend        = isValidAddress && isValidAmount && !isPending && !isConfirming;

  if (isConfirmed && !showSuccess) {
    setShowSuccess(true);
    setAmount('');
    setRecipient('');
    setTimeout(() => setShowSuccess(false), 4000);
  }

  function handleSend() {
    if (!canSend) return;
    writeContract({
      address: contractAddress,
      abi,
      functionName: 'transfer',
      args: [recipient as `0x${string}`, parseUnits(amount, 18)],
    });
  }

  return {
    token, setToken,
    recipient, setRecipient,
    amount, setAmount,
    balance: balance as bigint | undefined,
    isPending,
    isConfirming,
    showSuccess,
    isValidAddress,
    canSend,
    handleSend,
  };
}
