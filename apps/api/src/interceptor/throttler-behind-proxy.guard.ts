// throttler-behind-proxy.guard.ts
import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    // if (req.ips && req.ips.length > 0) {
    //     console.log('req.ips:', req.ips);
    // }
    // if (req.ip) {
    //     console.log('req.ip:', req.ip);
    // }
    const real_ip = req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs

    // console.log('proxy req real_ip:', real_ip);
    return real_ip;
  }
}
