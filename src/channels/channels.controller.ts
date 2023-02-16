import {
  ConsoleLogger,
  Controller,
  Get,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthentificatedGuard } from "src/auth/guards/authentificated.guard";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ChannelsService } from "./channels.service";

@Controller("channels")
export class ChannelsController {
  private readonly logger = new ConsoleLogger(ChannelsController.name);
  constructor(private readonly channelsService: ChannelsService) {}

  @UseGuards(AuthentificatedGuard, JwtAuthGuard)
  @Get("/testadmin")
  async testAdmin(@Request() req) {
    return this.channelsService.getChannels(req.user.id);
  }
}
