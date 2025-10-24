import { Strategy } from 'passport-local';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { IAuthService } from '../IAuthService';
import { BearedUser } from '../BearedUser';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('LOCAL_AUTH_SERVICE') private readonly authService: IAuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<BearedUser> {
    if (this.authService) {
      // console.log(this.authService);

      return this.authService.validateUser({
        id: username,
        name: username,
        secret: password,
      });
    }

    throw new NotFoundException('authService is null');
  }
}
