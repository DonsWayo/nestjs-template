import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService
  ) { }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get<string[]>('roles', context.getHandler());
    const req = context.switchToHttp().getRequest();
    return this.userService.findById(req.user.id)
      .then((data) => {
        const user = data;
        const hasRole = user.role.some(rol => role.find(item => item === rol));
        return user && user.role && hasRole;
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  }
}
