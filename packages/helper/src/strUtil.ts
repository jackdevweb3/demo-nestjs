import { v4 as uuidV4 } from 'uuid';
export const snakeToCamel = (str: string) =>
  str
    .toLowerCase()
    .replace(/[-_][a-z]/g, (group) => group.slice(-1).toUpperCase());

export const capitalize = (str: string) =>
  str.replace(/^[a-z]/g, (group) => group.slice(-1).toUpperCase());

export const firstLetterUpper = (str: string) => capitalize(str.toLowerCase());

export const uuid = () => uuidV4();

export const shortWalletAddress = (address: string, prefixLength?: number, suffixLength?: number) =>
  address ? `${address.slice(0, prefixLength || 6)}...${address.slice(-1 * (suffixLength || 4))}` : '';


export default { snakeToCamel, uuid, shortWalletAddress };
