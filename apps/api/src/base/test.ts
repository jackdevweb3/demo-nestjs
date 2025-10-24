 
type Falsy = null | undefined | false | 0 | -0 | 0n | '';

type Truthy<T> = T extends Falsy ? never : T;

export function assertTruthy<T = unknown>(condition: T, errMsg: string): condition is Truthy<T> {
  if (!condition) {
    throw new Error(errMsg);
  }
  return true;
}
