import {
  ConsoleLogger,
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { LoggedReq } from "src/users/user.types";
import { UsersService } from "src/users/users.service";
import { AuthService } from "./auth.service";
import { Role, Roles } from "./decorators/roles.decorators";
import { AuthentificatedGuard } from "./guards/authentificated.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";

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
  @Roles(Role.USER)
  @Get("/testadmin")
  async testAdmin(@Request() req: LoggedReq) {
    return {
      message: "You are premium user",
      expire: req.session.cookie.maxAge,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  async loginUser(@Request() req) {
    // We need to validate this
    if (!req.user)
      throw new UnauthorizedException("You are not authorized to do that");

    if (req.body.remember) {
      req.session.cookie.expires = new Date(Date.now() + 34560000000);
      req.session.cookie.maxAge = 34560000000;
    }
    this.logger.log(
      `${req.user.email} logged in ${req.body.remember ? "(remember me)" : ""}`
    );

    return req.user;
  }

  @UseGuards(LocalAuthGuard)
  @Post("/register")
  async registerUser(@Request() req) {
    // We need to validate this
    if (!req.user)
      throw new UnauthorizedException("You are not authorized to do that");
    this.logger.log(`${req.user.email} registered and logged in`);

    return req.user;
  }
}
