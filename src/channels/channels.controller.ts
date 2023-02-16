import { ConsoleLogger, Controller, Get, UseGuards, Request } from "@nestjs/common";
import { Role, Roles } from "src/auth/decorators/roles.decorators";
import { AuthentificatedGuard } from "src/auth/guards/authentificated.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("channels")
export class ChannelsController {
  private readonly logger = new ConsoleLogger(ChannelsController.name);

  @UseGuards(AuthentificatedGuard, JwtAuthGuard)
//   @Roles(Role.PREMIUM)
  @Get("/testadmin")
  async testAdmin(@Request() req) {
    return { message: "You are premium user" };
  }
}
