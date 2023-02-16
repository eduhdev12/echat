import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ChannelsService, PrismaService],
  controllers: [ChannelsController]
})
export class ChannelsModule {}
