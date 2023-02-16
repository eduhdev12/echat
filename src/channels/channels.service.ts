import { ConsoleLogger, Injectable } from "@nestjs/common";
import { Channel } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

export interface UserChannel extends Channel {
  targetUser?: {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
  };
}

@Injectable()
export class ChannelsService {
  private readonly logger = new ConsoleLogger(ChannelsService.name);
  constructor(private prisma: PrismaService) {}

  async getChannels(userId: number) {
    let channelData: UserChannel[] = await this.prisma.channel.findMany({
      where: { users: { some: { id: userId } } },
    });

    await Promise.all(
      channelData.map(async (channel) => {
        if (!channel.isGroup) {
          let channelMembers = await this.prisma.channel.findUnique({
            where: { id: channel.id },
            select: {
              users: {
                select: {
                  id: true,
                  username: true,
                  email: true,
                  createdAt: true,
                },
              },
            },
          });

          let channelUser = channelMembers.users.filter(
            (user) => user.id !== userId
          );

          if (channelUser.length > 1 || !channelUser[0]) return;

          channel.targetUser = channelUser[0];
        }
      })
    );

    return channelData;
  }
}
