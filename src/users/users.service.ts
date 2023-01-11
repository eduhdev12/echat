import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async find(
    userWhereUnique: Prisma.UserWhereUniqueInput
  ): Promise<User | null> {
    let user = await this.prisma.user.findUnique({ where: userWhereUnique });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }
}
