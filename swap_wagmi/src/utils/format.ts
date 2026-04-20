export function formatBalance(balance: bigint | undefined, decimals: number = 18): string {
  if (balance === undefined || balance === null || typeof balance !== 'bigint') return '0.0000';

  const value = Number(balance) / Math.pow(10, decimals);

  if (value === 0) return '0.0000';
  if (value < 0.0001) return value.toFixed(8);

  return value.toFixed(4);
}
