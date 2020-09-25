import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string[]>('roles', context.getHandler());
    const req = context.switchToHttp().getRequest();
    return this.userService.findById(req.user.id)
      .then((data) => {
        const user = data;
        const hasRole = user.roles.some(rol => role.find(item => item === rol));
        return user && user.roles && hasRole;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
