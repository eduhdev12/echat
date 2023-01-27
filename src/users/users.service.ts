import {
  ConsoleLogger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
  private readonly logger = new ConsoleLogger(UsersService.name);
  constructor(private prisma: PrismaService) {}

  async find(userWhereUnique: Prisma.UserWhereUniqueInput) {
    let user = await this.prisma.user.findUnique({
      where: userWhereUnique,
      select: {
        id: true,
        username: true,
        avatar: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async findByEmail(email: string) {
    let user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async createUser(email: string, password: string) {
    try {
      let hashedPassword = await bcrypt.hash(password, 10);

      let newUser = await this.prisma.user.create({
        data: {
          username: "testuser", // We need to create a username generator algorithm
          email,
          hashedPassword,
        },
        select: { username: true, email: true },
      });
      this.logger.log(`New user created: ${email}`);

      return newUser;
    } catch (error) {
      this.logger.warn(`Error while creating user`, error);
      throw new UnauthorizedException("You are not authorized");
    }
  }
}
