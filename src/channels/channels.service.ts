import { ConsoleLogger, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChannelsService {
  private readonly logger = new ConsoleLogger(ChannelsService.name);
  constructor(private prisma: PrismaService) {}

  async getChannels(userId: number) {
    let channelData = await this.prisma.channel.findMany({
      where: { users: { some: { id: userId } } },
    });

    return channelData;
  }
}
