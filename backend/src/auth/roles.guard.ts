import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

type AuthRequest = Request & { user?: { id: string; role: 'ADMIN' | 'CUSTOMER' } };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<Array<'ADMIN' | 'CUSTOMER'>>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!request.user || !roles.includes(request.user.role)) {
      throw new ForbiddenException('Only an admin can do this');
    }

    return true;
  }
}
