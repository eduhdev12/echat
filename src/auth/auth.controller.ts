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
import { AuthentificatedGuard } from "./guards/authentificated.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { Role, Roles } from "./roles.decorators";

@Controller("auth")
export class AuthController {
  private readonly logger = new ConsoleLogger(AuthController.name);
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(AuthentificatedGuard, JwtAuthGuard)
  @Get("/test")
  async test(@Request() req) {
    return await this.userService.find({ id: 1 });
  }

  @UseGuards(AuthentificatedGuard, JwtAuthGuard)
  @Roles(Role.PREMIUM)
  @Get("/testadmin")
  async testAdmin(@Request() req) {
    return { message: "You are premium user" };
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async loginUser(@Request() req) {
    // We need to validate this

    return req.user;
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
