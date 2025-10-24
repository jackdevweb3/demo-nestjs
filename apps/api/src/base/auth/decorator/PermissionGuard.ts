// import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { UserPermission } from '../../constant';
// import { UserCache } from '../../kv/user.cache';
// import { AuthorizedUser } from '../../../auth/AuthorizedUser';
//
// export const HasPermission = (...required: UserPermission[]) => SetMetadata('required', required);
//
// @Injectable()
// export class PermissionGuard implements CanActivate {
//   constructor(
//     private readonly reflector: Reflector,
//     private readonly authorizedUser: AuthorizedUser,
//     private readonly userCache: UserCache,
//   ) { }
//
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const requiredPermissions = this.reflector.getAllAndOverride<UserPermission[]>('required', [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//
//     const user = await this.userCache.getCachedUser(this.authorizedUser.get().account);
//     if (!user || !user.permissions) return false;
//     return requiredPermissions.some((p) => p & user.permissions);
//   }
// }
