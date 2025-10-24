

export const shortWalletAddress = (
  address: string,
  prefixLength?: number,
  suffixLength?: number,
) =>
  address
    ? `${address.slice(0, prefixLength || 6)}...${address.slice(-1 * (suffixLength || 4))}`
    : '';



export default {
  shortWalletAddress,
};
