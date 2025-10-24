export function isMainInstance(): boolean {
  if (process.env.NODE_APP_INSTANCE && parseInt(process.env.NODE_APP_INSTANCE) !== 0) {
    //for pm2 cluster mode
    console.warn(
      `process.env.NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE},not main instance when under cluster mode`,
    );
    return false; //is not main instance
  }

  return true;
}
export function isEnableCronJob(): boolean {
  if (process.env.ENABLE_CRON_JOB && process.env.ENABLE_CRON_JOB.toLowerCase() === 'false') {
    //for pm2 cluster mode
    console.warn(`process.env.ENABLE_CRON_JOB=${process.env.ENABLE_CRON_JOB}`);
    return false; // disable cron job
  }

  return true;
}

export function getInstanceId(): string {
  if (process.env.NODE_APP_INSTANCE) {
    //for pm2 cluster mode
    console.warn(`process.env.NODE_APP_INSTANCE=${process.env.NODE_APP_INSTANCE}`);
    return process.env.NODE_APP_INSTANCE || '0';
  }

  return '0';
}

export class FunctionExt {
  constructor() { }

  public static async sleep(delayInMiliseconds: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          resolve(1);
        } catch (e) {
          reject(0);
        }
      }, delayInMiliseconds);
    });
  }

  public static convertHex2Utf8(hex: string): string {
    return Buffer.from(hex.startsWith('0x') ? hex.slice(2) : hex, 'hex').toString('utf-8');
  }
  public static convertHex2Uft8(hex: string): string {
    if (hex.startsWith('0x')) return Buffer.from(hex.slice(2), 'hex').toString('utf-8');
    return Buffer.from(hex, 'hex').toString('utf-8');
  }
  public static formatDate(d: Date, fmt: string) {
    const o = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'h+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      S: d.getMilliseconds(),
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (const k in o)
      if (new RegExp('(' + k + ')').test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length),
        );
    return fmt;
  }
}

export function isTestNet(): boolean {
  const env = process.env.IS_TESTNET;
  if (env !== undefined) {
    return `${env}`.toLowerCase() === 'true';
  }
  return true;
}
export function isDevMode(): boolean {
  const env = process.env.IS_DEVMODE;
  if (env === undefined) {
    return true;
  }
  return `${env}`.toLowerCase() === 'true';
}
export function isEnbaleUploadTweetToGreenfield(): boolean {
  const env = process.env.ENABLE_GREENFIELD_UPLOAD_TWEET || 'false';
  if (env != undefined && env.toLowerCase() === 'true') {
    return true;
  }
  return false;
}


export function getRandomInt(min: number, max: number): number {
  // 确保min和max是整数
  min = Math.ceil(min);
  max = Math.floor(max);

  // (Math.random() * (max - min + 1))随机地生成0到(max - min)之间的一个小数，Math.floor向下取整后再加上min，使得结果为min到max（包括）之间的整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}