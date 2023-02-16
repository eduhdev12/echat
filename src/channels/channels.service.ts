import { ConsoleLogger, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChannelsService {
  private readonly logger = new ConsoleLogger(ChannelsService.name);
  constructor(private prisma: PrismaService) {}

  
}
