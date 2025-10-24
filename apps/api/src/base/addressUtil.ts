import { chain } from '@repo/helper';
import bs58check from 'bs58check';
import { checksumAddress } from 'viem';

export const shortWalletAddress = (
  address: string,
  prefixLength?: number,
  suffixLength?: number,
) =>
  address
    ? `${address.slice(0, prefixLength || 6)}...${address.slice(-1 * (suffixLength || 4))}`
    : '';

export const convertTronToEVMAddress = (tronAddress: string) => {
  if (tronAddress.startsWith('T')) {
    const hexAddress = '0x' + bs58check.decode(tronAddress).toString().slice(2);
    return checksumAddress(hexAddress as `0x${string}`);
  }
  return tronAddress;
};
export const convertEVMToTronAddress = (evmAddress: string) => {
  // 去掉 '0x' 前缀，并将十六进制字符串转为 Buffer
  if (!evmAddress.startsWith('0x')) {
    throw new Error('Invalid EVM address: must start with 0x');
  }
  const hexWithoutPrefix = Buffer.from(evmAddress.slice(2), 'hex');

  // 检查地址长度是否为 20 字节
  if (hexWithoutPrefix.length !== 20) {
    throw new Error('Invalid EVM address: must be 20 bytes long');
  }
  // 添加 TRON 前缀 0x41（主网）
  const tronPrefix = Buffer.from([0x41]);
  const tronHex = Buffer.concat([tronPrefix, hexWithoutPrefix]);

  console.log(`tronHex`, tronHex);

  // 将 Hex 字符串转换为 Buffer (Uint8Array)
  // @ts-ignore
    const tronBuffer = Buffer.from(tronHex, 'hex');
  // 使用 bs58check 编码
  const tronAddress = bs58check.encode(tronBuffer);

  return tronAddress;
};

export enum SignChainTypeEnum {
  evm = 'evm',
  tron = 'tron',
}
export const isTron = (chain: chain.ChainType) => {
  return chain.name.startsWith('Tron') || chain.name.startsWith('Tron');
};

export default {
  shortWalletAddress,
  convertTronToEVMAddress,
  convertEVMToTronAddress,
  isTron,
  SignChainTypeEnum,
};
