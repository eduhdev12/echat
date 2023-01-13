import {
  ConsoleLogger,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
  private readonly logger = new ConsoleLogger(UsersService.name);
  constructor(private prisma: PrismaService) {}

  async find(
    userWhereUnique: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    let user = await this.prisma.user.findUnique({ where: userWhereUnique }); // We need to remove hashed password from result query

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    let user = await this.prisma.user.findUnique({ where: { email: email } }); // We need to remove hashed password from result query

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async createUser(email: string, password: string) {
    try {
      let newUser = await this.prisma.user.create({
        data: {
          username: "testuser", // We need to create a username generator algorithm
          email,
          hashedPassword: password, // We need to hash the password
        },
        select: { username: true, email: true },
      });
      this.logger.log(`New user created: ${email}`);

      return newUser;
    } catch (error) {
      throw new UnauthorizedException("You are not authorized");
    }
  }
}
