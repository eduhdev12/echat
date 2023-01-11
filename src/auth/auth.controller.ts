import { ConsoleLogger, Controller, Get, Request } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);
  constructor(private readonly userService: UsersService) {}

  @Get("/test")
  async test(@Request() req) {
    return await this.userService.find({ id: 1 });
  }
}
