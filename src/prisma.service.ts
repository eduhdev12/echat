import {
  ConsoleLogger,
  INestApplication,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new ConsoleLogger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log("Prisma connected");
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
