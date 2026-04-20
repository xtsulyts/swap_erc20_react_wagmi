import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { parseAbiItem } from 'viem';
import { CONTRACTS } from '../config/contracts';

export type TxType = 'swap' | 'add' | 'remove';

export interface TxEvent {
  type: TxType;
  hash: `0x${string}` | null;
  blockNumber: bigint;
  swapper?: string;
  tokenIn?: string;
  amountIn?: bigint;
  amountOut?: bigint;
  provider?: string;
  amountA?: bigint;
  amountB?: bigint;
}

const SWAPPED_EVENT       = parseAbiItem('event Swapped(address indexed swapper, address indexed tokenIn, uint256 amountIn, uint256 amountOut)');
const LIQUIDITY_ADDED     = parseAbiItem('event LiquidityAdded(address indexed provider, uint256 amountA, uint256 amountB)');
const LIQUIDITY_REMOVED   = parseAbiItem('event LiquidityRemoved(address indexed provider, uint256 amountA, uint256 amountB)');

export function useTxHistory() {
  const client = usePublicClient();

  return useQuery({
    queryKey: ['tx-history'],
    queryFn: async (): Promise<TxEvent[]> => {
      if (!client) return [];

      const latest = await client.getBlockNumber();
      const fromBlock = latest > 50000n ? latest - 50000n : 0n;

      const [swapped, added, removed] = await Promise.all([
        client.getLogs({ address: CONTRACTS.SIMPLE_DEX, event: SWAPPED_EVENT,     fromBlock, toBlock: 'latest' }),
        client.getLogs({ address: CONTRACTS.SIMPLE_DEX, event: LIQUIDITY_ADDED,   fromBlock, toBlock: 'latest' }),
        client.getLogs({ address: CONTRACTS.SIMPLE_DEX, event: LIQUIDITY_REMOVED, fromBlock, toBlock: 'latest' }),
      ]);

      const events: TxEvent[] = [
        ...swapped.map((e) => ({
          type: 'swap' as TxType,
          hash: e.transactionHash,
          blockNumber: e.blockNumber ?? 0n,
          swapper:   e.args.swapper,
          tokenIn:   e.args.tokenIn,
          amountIn:  e.args.amountIn,
          amountOut: e.args.amountOut,
        })),
        ...added.map((e) => ({
          type: 'add' as TxType,
          hash: e.transactionHash,
          blockNumber: e.blockNumber ?? 0n,
          provider: e.args.provider,
          amountA:  e.args.amountA,
          amountB:  e.args.amountB,
        })),
        ...removed.map((e) => ({
          type: 'remove' as TxType,
          hash: e.transactionHash,
          blockNumber: e.blockNumber ?? 0n,
          provider: e.args.provider,
          amountA:  e.args.amountA,
          amountB:  e.args.amountB,
        })),
      ];

      return events
        .sort((a, b) => (a.blockNumber > b.blockNumber ? -1 : 1))
        .slice(0, 30);
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}
