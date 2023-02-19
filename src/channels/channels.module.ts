import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { ChannelsController } from "./channels.controller";
import { ChannelsGateway } from "./channels.gateway";
import { ChannelsService } from "./channels.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "4d" },
    }),
  ],
  providers: [ChannelsService, PrismaService, ChannelsGateway],
  controllers: [ChannelsController],
})
export class ChannelsModule {}
