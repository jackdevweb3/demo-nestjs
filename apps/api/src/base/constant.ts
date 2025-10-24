import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';




//prisma --begin
export type TransactionType = Omit<PrismaClient, runtime.ITXClientDenyList>;

export const PRISMA_TX_OPTIONS = {
  maxWait: 10000, // default: 2000
  timeout: 20000, // default: 5000
};
//prisma --end

//redis --begin
export const RedisKeys = {

};

//redis --end

//business related --begin

export enum Fields {

  accountInIM = 'accountInIM',
  correlationId = 'correlationId',
}


//business related --end






