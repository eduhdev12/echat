import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export class AuthentificatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    return request.isAuthenticated();
  }
}
