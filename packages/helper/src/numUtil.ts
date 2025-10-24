export const roundToTwo = (num: number) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

export const convertToRoman = (num: number) => {
  const romanNumList = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  const decimalNumList = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let romanized = "";

  for (let i = 0; i < decimalNumList.length; i++) {
    while (decimalNumList[i] ?? 0 <= num) {
      romanized += romanNumList[i];
      num -= decimalNumList[i] ?? 0;
    }
  }

  return romanized;
};

export const ordinalSuffix = (num: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = num % 100;
  return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
}

/**
 * make number go from 1 to 1st, 2 to 2nd, 3 to 3rd, etc.
 */
export const withOrdinalSuffix = (num: number) => `${num}${ordinalSuffix(num)}`;

/**
 * convert number str to BigInt
 */
export const numToBigInt = (num: string) => {
  if (typeof num != 'string') {
    num = String(num);
  }
  
  if (!num) {
    return BigInt(0);
  } 
  const actualNum = num.startsWith("0x")
    ? Number.parseInt(num, 16)
    : Number.parseInt(num, 10);
  return BigInt(actualNum);
};