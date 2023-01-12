import {
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get("/test")
  async test(@Request() req) {
    return await this.userService.find({ id: 1 });
  }

  @Post("/login")
  async loginUser(@Request() req) {
    let { email, password } = req.body;

    if (!email || !password)
      throw new UnauthorizedException("You are not authorized");

    return await this.authService.login({ email: email, password: password });
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
