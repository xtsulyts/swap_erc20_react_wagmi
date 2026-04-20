import simpleDexABI from '../contratos/simpleDexABI.json';
import tokenAABI from '../contratos/erc20ABI/tokenAABI.json';
import tokenBABI from '../contratos/erc20ABI/tokenBABI.json';

export const CONTRACTS = {
  SIMPLE_DEX: '0x3D5B5a5328a0f29375b3cDcBE31B1aB5c2AB906A' as `0x${string}`,
  TOKEN_A:    '0x039EC09b85F1C317F0831B100eFd5c4e2463f372' as `0x${string}`,
  TOKEN_B:    '0xBeaC73A7755BeED1337Ca95137EB8b9247f88542' as `0x${string}`,
} as const;

export { simpleDexABI, tokenAABI, tokenBABI };
