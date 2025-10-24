import { BearedUser } from './BearedUser';

export interface AuthParameter {
  id: string;
  name: string;
  secret: string;
}
export interface IAuthService {
  validateUser(parameter: AuthParameter): Promise<BearedUser>;
}
