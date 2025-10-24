import { DefaultIdentifierGenerator } from 'idworker';
import { assertTruthy } from '../base/test';
import { parse, format as dateFormat } from 'date-fns';
import format from '@stdlib/string-format';

let generator;
const init = () => {
  const hostId = parseInt(process.env.HOST_ID);
  if (hostId < 0 || hostId > 1024) {
    console.warn('Host id is not valid: {}, using random id', hostId);
  }
  generator =
    hostId >= 0 && hostId < 1024
      ? new DefaultIdentifierGenerator({
          workerId: hostId % 32,
          datacenterId: Math.floor(hostId / 32),
        })
      : new DefaultIdentifierGenerator();
};

init();

export const generateId = () => {
  return BigInt(generator.nextId());
};

const fragmentBits = BigInt(22);
const fragmentMask = ~(BigInt(-1) << fragmentBits);
const startEpoch = BigInt(1288834974657);

export const toBusinessNumber = (prefix: string = '', id: bigint, tag: number) => {
  const timestamp = startEpoch + (id >> fragmentBits);
  const date = dateFormat(new Date(Number(timestamp)), 'yyyyMMddHHmmss');
  return format(
    '%1$s%2$s%3$07d%4$03d%5$03d',
    prefix,
    date,
    id & fragmentMask,
    (tag << 1) | Math.floor(Math.random() * 2),
    Number(timestamp) % 1000,
  );
};

export const parseBusinessNumber = (no: string) => {
  const sequence = no.substring(no.length - 27);
  assertTruthy(sequence.length == 27, 'Length does not match');

  const date: bigint =
    BigInt(parse(sequence.substring(0, 14), 'yyyyMMddHHmmss', new Date()).getTime()) +
    BigInt(sequence.substring(24, 27));
  if (date <= startEpoch) {
    throw new Error('Invalid no');
  }

  const fragment: bigint = BigInt(sequence.substring(14, 21));
  return ((date - startEpoch) << fragmentBits) | fragment;
};

export const parseTag = (no: string) => {
  const sequence = no.substring(no.length - 27);
  assertTruthy(sequence.length == 27, 'Length does not match');

  return Number(sequence.substring(21, 24)) >> 1;
};
