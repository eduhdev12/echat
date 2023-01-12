import {
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get("/test")
  async test(@Request() req) {
    return await this.userService.find({ id: 1 });
  }

  @Post("/register")
  async registerUser(@Request() req) {
    let { email, password } = req.body;

    if (!email || !password)
      throw new UnauthorizedException("You are not authorized");

    let registeredUser = await this.authService.register(email, password);

    return registeredUser;
  }
}
